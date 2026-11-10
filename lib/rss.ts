import type { Entry } from "@/lib/types";
import { site } from "@/lib/content";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function rfc822(iso: string): string {
  // WordPress stored these as America/Los_Angeles wall times.
  return new Date(`${iso}-07:00`).toUTCString();
}

export function renderFeed(options: {
  title: string;
  description: string;
  path: string;
  entries: Entry[];
}): string {
  const link = `${site.url}${options.path}`;
  const items = options.entries
    .map((entry) => {
      const url = `${site.url}/${entry.slug}/`;
      const image = entry.featuredImage
        ? `<enclosure url="${escapeXml(site.url + entry.featuredImage)}" type="${
            entry.featuredImage.endsWith(".png") ? "image/png" : "image/jpeg"
          }" />`
        : "";
      return `<item>
<title>${escapeXml(entry.title)}</title>
<link>${escapeXml(url)}</link>
<guid isPermaLink="true">${escapeXml(url)}</guid>
<pubDate>${rfc822(entry.date)}</pubDate>
<description>${cdata(entry.excerpt)}</description>
<content:encoded>${cdata(entry.contentHtml)}</content:encoded>
${image}
</item>`;
    })
    .join("\n");

  const updated = options.entries[0]?.date ?? "2023-05-20T16:59:15";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(options.title)}</title>
<link>${escapeXml(link)}</link>
<atom:link href="${escapeXml(link)}" rel="self" type="application/rss+xml" />
<description>${escapeXml(options.description)}</description>
<language>en-US</language>
<lastBuildDate>${rfc822(updated)}</lastBuildDate>
<managingEditor>${escapeXml(site.email)} (${escapeXml(site.author.name)})</managingEditor>
<webMaster>${escapeXml(site.email)} (${escapeXml(site.author.name)})</webMaster>
${items}
</channel>
</rss>`;
}
