import siteData from "@/content/site.json";
import type { Entry, SiteData, Term, TermRef } from "@/lib/types";

const data = siteData as SiteData;

export const PER_PAGE = 10;
export const site = data.site;
export const posts = data.posts;
export const pages = data.pages;
export const categories = data.categories;
export const tags = data.tags;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function orderedCategories(categories: TermRef[]): TermRef[] {
  return [...categories].sort((a, b) => b.id - a.id);
}

export function formatDate(iso: string): string {
  const [date] = iso.split("T");
  const [year, month, day] = date.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PER_PAGE));
}

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PER_PAGE;
  return items.slice(start, start + PER_PAGE);
}

export function getEntry(slug: string): Entry | undefined {
  return posts.find((post) => post.slug === slug) ?? pages.find((page) => page.slug === slug);
}

export function getCategory(slug: string): Term | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getTag(slug: string): Term | undefined {
  return tags.find((tag) => tag.slug === slug);
}

export function postsInCategory(slug: string): Entry[] {
  return posts.filter((post) => post.categories.some((category) => category.slug === slug));
}

export function postsWithTag(slug: string): Entry[] {
  return posts.filter((post) => post.tags.some((tag) => tag.slug === slug));
}

export function getPostBySlug(slug: string): Entry | undefined {
  return posts.find((post) => post.slug === slug);
}

export function sidebarPosts(): Entry[] {
  return site.sidebarPosts
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Entry => Boolean(post));
}

export function trendingPosts(): Entry[] {
  return site.trending
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Entry => Boolean(post));
}

export function categoriesInNav(): Term[] {
  return categories
    .filter((category) => category.count > 0)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function searchEntries(query: string): Entry[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return posts.filter((post) => {
    const haystack = `${post.title} ${post.excerpt} ${post.plainText} ${post.categories
      .map((category) => category.name)
      .join(" ")} ${post.tags.map((tag) => tag.name).join(" ")}`.toLowerCase();
    return haystack.includes(needle);
  });
}
