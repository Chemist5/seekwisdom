import type { MetadataRoute } from "next";
import { categories, pageCount, pages, posts, site, tags } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = posts[0]?.modified ?? posts[0]?.date;
  const homePages = Array.from({ length: Math.max(0, pageCount(posts.length) - 1) }, (_, index) => ({
    url: `${site.url}/page/${index + 2}/`,
    lastModified: now,
  }));
  const authorPages = Array.from({ length: Math.max(0, pageCount(posts.length) - 1) }, (_, index) => ({
    url: `${site.url}/author/${site.author.slug}/page/${index + 2}/`,
    lastModified: now,
  }));

  return [
    { url: `${site.url}/`, lastModified: now },
    ...homePages,
    ...posts.map((post) => ({
      url: `${site.url}/${post.slug}/`,
      lastModified: post.modified || post.date,
    })),
    ...pages.map((page) => ({
      url: `${site.url}/${page.slug}/`,
      lastModified: page.modified || page.date,
    })),
    ...categories.map((category) => ({
      url: `${site.url}/category/${category.slug}/`,
    })),
    ...tags.map((tag) => ({
      url: `${site.url}/tag/${tag.slug}/`,
    })),
    { url: `${site.url}/author/${site.author.slug}/` },
    ...authorPages,
    { url: `${site.url}/videos/` },
  ];
}
