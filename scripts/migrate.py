#!/usr/bin/env python3
"""Pull published Seek Wisdom posts, pages, terms, and images into the repo.

Reads the public WordPress REST API and the rendered permalinks (for Rank Math
titles and descriptions). Does not write to the live site.
"""

from __future__ import annotations

import json
import re
import ssl
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
CONTENT = ROOT / "content"
ORIGIN = "https://seekwisdom.co"
UA = (
    "Mozilla/5.0 (compatible; SeekWisdomStaticMigration/1.0; +https://seekwisdom.co/)"
)

EXTRA_ASSETS = [
    "/wp-content/uploads/2023/03/Seek-Wisdom-Logo-White.png",
    "/wp-content/uploads/2023/03/Seek-Wisdom-Logo-White-300x300.png",
    "/wp-content/uploads/2023/03/Seek-Wisdom-Logo-White-150x150.png",
    "/wp-content/uploads/2023/03/cropped-Seek-Wisdom-Logo-2-32x32.png",
    "/wp-content/uploads/2023/03/cropped-Seek-Wisdom-Logo-2-192x192.png",
    "/wp-content/uploads/2023/03/cropped-Seek-Wisdom-Logo-2-180x180.png",
]

SIDEBAR_POSTS = [
    "why-your-mindset-is-everything-in-life",
    "how-to-believe-in-yourself-quotes",
    "making-your-own-luck-building-character",
    "mindfulness-exercises-for-anxiety",
]

TRENDING = [
    "overcoming-the-fear-of-failure",
    "will-ai-take-over-the-world",
    "change-your-thoughts-change-your-life",
    "5-simple-ways-to-master-any-subject",
]


def fetch(url: str, timeout: int = 40) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return response.read()
        except Exception as error:  # noqa: BLE001 - retry network failures
            last_error = error
            time.sleep(0.8 * (attempt + 1))
    assert last_error is not None
    raise last_error


def fetch_json(url: str):
    return json.loads(fetch(url).decode("utf-8"))


def plain_title(rendered: str) -> str:
    text = re.sub(r"<[^>]+>", "", rendered)
    return unescape(text).replace("\xa0", " ").strip()


def html_to_text(html: str) -> str:
    text = re.sub(r"<script\b[^>]*>.*?</script>", " ", html, flags=re.I | re.S)
    text = re.sub(r"<style\b[^>]*>.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = unescape(text).replace("\xa0", " ")
    return re.sub(r"\s+", " ", text).strip()


def seo_from_html(html: str) -> tuple[str, str]:
    title_match = re.search(r"<title[^>]*>(.*?)</title>", html, flags=re.I | re.S)
    title = unescape(re.sub(r"\s+", " ", title_match.group(1))).strip() if title_match else ""
    description = ""
    for tag in re.findall(r"<meta\b[^>]*>", html, flags=re.I):
        if re.search(r'\bname\s*=\s*["\']description["\']', tag, flags=re.I):
            content = re.search(r'\bcontent\s*=\s*["\'](.*?)["\']', tag, flags=re.I | re.S)
            if content:
                description = unescape(content.group(1)).strip()
            break
    return title, description


def scrape_seo(url: str) -> tuple[str, str, str | None]:
    try:
        html = fetch(url, timeout=30).decode("utf-8", "replace")
        title, description = seo_from_html(html)
        return title, description, None
    except Exception as error:  # noqa: BLE001
        return "", "", str(error)


def clean_html(html: str, known_slugs: set[str]) -> str:
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.I | re.S)
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    html = re.sub(r"\s+on\w+\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)", "", html, flags=re.I)

    def trim_href(match: re.Match[str]) -> str:
        quote = match.group(1)
        url = match.group(2).strip()
        return f"href={quote}{url}{quote}"

    html = re.sub(r"href\s*=\s*([\"'])\s*(.*?)\s*\1", trim_href, html, flags=re.I | re.S)

    def date_permalink(match: re.Match[str]) -> str:
        slug = match.group(1)
        if slug in known_slugs:
            return f"/{slug}/"
        return match.group(0)

    html = re.sub(
        r"https?://seekwisdom\.co/\d{4}/\d{2}/\d{2}/([^/\"'\s]+)/?",
        date_permalink,
        html,
        flags=re.I,
    )
    html = html.replace("https://seekwisdom.co/wp-content/", "/wp-content/")
    html = html.replace("http://seekwisdom.co/wp-content/", "/wp-content/")
    html = html.replace("https://seekwisdom.co/", "/")
    html = html.replace("http://seekwisdom.co/", "/")
    html = html.replace("//seekwisdom.co/wp-content/", "/wp-content/")
    return html


def asset_paths(html: str) -> set[str]:
    found = set(re.findall(r"/wp-content/uploads/[^\"'\s)]+", html))
    return {path.split("?")[0] for path in found if not path.endswith("/")}


def unsized_variant(path: str) -> str:
    return re.sub(r"-\d+x\d+(?=\.[A-Za-z0-9]+$)", "", path)


def repair_missing(html: str, present: set[str]) -> tuple[str, list[str]]:
    missing: list[str] = []

    def replace(match: re.Match[str]) -> str:
        path = match.group(0).split("?")[0]
        if path in present:
            return path
        fallback = unsized_variant(path)
        if fallback != path and fallback in present:
            return fallback
        missing.append(path)
        return path

    repaired = re.sub(r"/wp-content/uploads/[^\"'\s)]+", replace, html)
    # Drop srcset candidates that still are not on disk.
    def fix_srcset(match: re.Match[str]) -> str:
        quote = match.group(1)
        parts = []
        for candidate in match.group(2).split(","):
            candidate = candidate.strip()
            if not candidate:
                continue
            url = candidate.split()[0]
            if url.startswith("/wp-content/uploads/") and url.split("?")[0] not in present:
                continue
            parts.append(candidate)
        if not parts:
            return ""
        return f"srcset={quote}{', '.join(parts)}{quote}"

    repaired = re.sub(
        r"srcset\s*=\s*([\"'])(.*?)\1",
        fix_srcset,
        repaired,
        flags=re.I | re.S,
    )
    return repaired, missing


def download_asset(path: str) -> tuple[str, str | None]:
    destination = PUBLIC / path.lstrip("/")
    if destination.exists() and destination.stat().st_size > 0:
        return path, None
    destination.parent.mkdir(parents=True, exist_ok=True)
    url = ORIGIN + path
    try:
        data = fetch(url, timeout=60)
    except Exception as error:  # noqa: BLE001
        return path, str(error)
    if data[:20].lstrip().lower().startswith(b"<!doctype") or data[:6].lower().startswith(b"<html"):
        return path, "response was HTML, not an image"
    destination.write_bytes(data)
    return path, None


def terms_from(embedded: dict, taxonomy: str) -> list[dict]:
    groups = embedded.get("wp:term") or []
    items = []
    for group in groups:
        if not isinstance(group, list):
            continue
        for term in group:
            if term.get("taxonomy") != taxonomy:
                continue
            items.append(
                {
                    "id": term["id"],
                    "slug": term["slug"],
                    "name": unescape(term["name"]),
                }
            )
    return items


def featured_of(post: dict) -> tuple[str | None, str, int | None, int | None]:
    media = (post.get("_embedded") or {}).get("wp:featuredmedia") or []
    if not media or not isinstance(media, list) or "source_url" not in media[0]:
        return None, "", None, None
    item = media[0]
    source = item["source_url"].split("?")[0]
    path = source.replace(ORIGIN, "")
    details = item.get("media_details") or {}
    return path, item.get("alt_text") or "", details.get("width"), details.get("height")


def build_entry(post: dict, kind: str, known_slugs: set[str]) -> dict:
    featured, alt, width, height = featured_of(post)
    content = clean_html(post["content"]["rendered"], known_slugs)
    excerpt_html = clean_html(post.get("excerpt", {}).get("rendered", ""), known_slugs)
    return {
        "id": post["id"],
        "slug": post["slug"],
        "type": kind,
        "title": plain_title(post["title"]["rendered"]),
        "date": post["date"],
        "modified": post["modified"],
        "excerpt": html_to_text(excerpt_html),
        "contentHtml": content,
        "plainText": html_to_text(content),
        "featuredImage": featured,
        "featuredAlt": alt,
        "featuredWidth": width,
        "featuredHeight": height,
        "categories": terms_from(post.get("_embedded") or {}, "category") if kind == "post" else [],
        "tags": terms_from(post.get("_embedded") or {}, "post_tag") if kind == "post" else [],
        "seoTitle": "",
        "seoDescription": "",
    }


def main() -> None:
    posts_raw = fetch_json(f"{ORIGIN}/wp-json/wp/v2/posts?per_page=100&_embed=1")
    pages_raw = fetch_json(f"{ORIGIN}/wp-json/wp/v2/pages?per_page=100&_embed=1")
    categories_raw = fetch_json(f"{ORIGIN}/wp-json/wp/v2/categories?per_page=100")
    tags_raw = fetch_json(f"{ORIGIN}/wp-json/wp/v2/tags?per_page=100")
    if len(posts_raw) != 32:
        raise SystemExit(f"expected 32 posts, got {len(posts_raw)}")
    if len(pages_raw) != 3:
        raise SystemExit(f"expected 3 pages, got {len(pages_raw)}")

    known_slugs = {item["slug"] for item in posts_raw + pages_raw}
    posts = [build_entry(item, "post", known_slugs) for item in posts_raw]
    pages = [build_entry(item, "page", known_slugs) for item in pages_raw]
    posts.sort(key=lambda item: item["date"], reverse=True)

    categories = [
        {
            "id": item["id"],
            "slug": item["slug"],
            "name": unescape(item["name"]),
            "description": html_to_text(item.get("description") or ""),
            "count": item["count"],
            "seoTitle": "",
            "seoDescription": "",
        }
        for item in categories_raw
    ]
    tags = [
        {
            "id": item["id"],
            "slug": item["slug"],
            "name": unescape(item["name"]),
            "description": html_to_text(item.get("description") or ""),
            "count": item["count"],
            "seoTitle": "",
            "seoDescription": "",
        }
        for item in tags_raw
    ]

    seo_jobs: list[tuple[str, str]] = [(f"{ORIGIN}/", "home")]
    seo_jobs.append((f"{ORIGIN}/author/seek-wisdom/", "author"))
    for entry in posts:
        seo_jobs.append((f"{ORIGIN}/{entry['slug']}/", f"post:{entry['slug']}"))
    for entry in pages:
        seo_jobs.append((f"{ORIGIN}/{entry['slug']}/", f"page:{entry['slug']}"))
    for term in categories:
        seo_jobs.append((f"{ORIGIN}/category/{term['slug']}/", f"category:{term['slug']}"))
    for term in tags:
        seo_jobs.append((f"{ORIGIN}/tag/{term['slug']}/", f"tag:{term['slug']}"))

    seo_results: dict[str, tuple[str, str, str | None]] = {}
    print(f"scraping {len(seo_jobs)} permalinks for titles and descriptions")
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(scrape_seo, url): key for url, key in seo_jobs}
        for future in as_completed(futures):
            seo_results[futures[future]] = future.result()

    seo_failures = []
    home_title, home_description, home_error = seo_results["home"]
    if home_error:
        seo_failures.append({"url": ORIGIN + "/", "error": home_error})
    author_title, author_description, author_error = seo_results["author"]
    if author_error:
        seo_failures.append({"url": f"{ORIGIN}/author/seek-wisdom/", "error": author_error})

    def apply_seo(entry: dict, key: str, fallback_title: str) -> None:
        title, description, error = seo_results[key]
        if error:
            seo_failures.append({"url": key, "error": error})
        entry["seoTitle"] = title or fallback_title
        entry["seoDescription"] = description or entry.get("excerpt") or entry.get("description") or ""

    for entry in posts:
        apply_seo(entry, f"post:{entry['slug']}", f"{entry['title']} - Seek Wisdom")
    for entry in pages:
        apply_seo(entry, f"page:{entry['slug']}", f"{entry['title']} - Seek Wisdom")
    for term in categories:
        apply_seo(term, f"category:{term['slug']}", f"{term['name']} - Seek Wisdom")
    for term in tags:
        apply_seo(term, f"tag:{term['slug']}", f"{term['name']} - Seek Wisdom")

    paths: set[str] = set(EXTRA_ASSETS)
    for entry in posts + pages:
        if entry["featuredImage"]:
            paths.add(entry["featuredImage"])
        paths.update(asset_paths(entry["contentHtml"]))
        paths.update(asset_paths(entry.get("excerpt") or ""))

    print(f"downloading {len(paths)} images")
    failures: list[dict[str, str]] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(download_asset, path) for path in sorted(paths)]
        for future in as_completed(futures):
            path, error = future.result()
            if error:
                failures.append({"path": path, "error": error})

    present = set()
    for path in paths:
        file_path = PUBLIC / path.lstrip("/")
        if file_path.exists() and file_path.stat().st_size > 0:
            present.add(path)

    # Second pass: sized derivatives that 404 can fall back to the full file.
    still_missing = []
    for entry in posts + pages:
        repaired, missing = repair_missing(entry["contentHtml"], present)
        entry["contentHtml"] = repaired
        for path in missing:
            fallback = unsized_variant(path)
            if fallback in present:
                entry["contentHtml"] = entry["contentHtml"].replace(path, fallback)
            elif path not in present:
                still_missing.append({"slug": entry["slug"], "path": path})
        if entry["featuredImage"] and entry["featuredImage"] not in present:
            fallback = unsized_variant(entry["featuredImage"])
            if fallback in present:
                entry["featuredImage"] = fallback
            else:
                still_missing.append({"slug": entry["slug"], "path": entry["featuredImage"]})
                entry["featuredImage"] = None

    # Anything that failed to download and is not referenced anymore is still a gap
    # if a post points at it. Report unique referenced misses plus download errors
    # for the logo and featured originals.
    referenced_missing = []
    seen = set()
    for item in still_missing:
        key = (item["slug"], item["path"])
        if key in seen:
            continue
        seen.add(key)
        referenced_missing.append(item)

    bluehost_left = []
    for entry in posts + pages:
        if "seekwisdom.co/wp-content" in entry["contentHtml"] or "bluehost" in entry["contentHtml"].lower():
            bluehost_left.append(entry["slug"])

    site = {
        "name": "Seek Wisdom",
        "tagline": "Advice Worth Following",
        "url": ORIGIN,
        "email": "seekwisdomco@gmail.com",
        "homeTitle": home_title or 'Seek Wisdom - "Advice Worth Following"',
        "homeDescription": home_description or '"Advice Worth Following"',
        "author": {
            "name": "Seek Wisdom",
            "slug": "seek-wisdom",
            "seoTitle": author_title or "Seek Wisdom - Seek Wisdom",
            "seoDescription": author_description or "",
        },
        "logo": "/wp-content/uploads/2023/03/Seek-Wisdom-Logo-White.png",
        "sidebarPosts": SIDEBAR_POSTS,
        "trending": TRENDING,
    }

    CONTENT.mkdir(parents=True, exist_ok=True)
    payload = {
        "site": site,
        "posts": posts,
        "pages": pages,
        "categories": categories,
        "tags": tags,
    }
    (CONTENT / "site.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    id_map = {str(entry["id"]): entry["slug"] for entry in posts + pages}
    (CONTENT / "id-map.json").write_text(json.dumps(id_map), encoding="utf-8")
    report = {
        "posts": len(posts),
        "pages": len(pages),
        "categories": len(categories),
        "tags": len(tags),
        "imagesRequested": len(paths),
        "imagesOnDisk": len(present),
        "downloadFailures": failures,
        "referencedMissingImages": referenced_missing,
        "seoFailures": seo_failures,
        "contentStillLinkingBluehost": bluehost_left,
    }
    (CONTENT / "migration-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("posts", "pages", "categories", "tags", "imagesRequested", "imagesOnDisk")}, indent=2))
    print("download failures", len(failures))
    print("referenced missing", len(referenced_missing))
    print("seo failures", len(seo_failures))
    print("bluehost leftovers", bluehost_left)


if __name__ == "__main__":
    main()
