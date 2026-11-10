import { categories, getCategory, postsInCategory, site } from "@/lib/content";
import { renderFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const category = getCategory(slug);
  if (!category) return new Response("Not found", { status: 404 });
  const xml = renderFeed({
    title: `${category.name} - ${site.name}`,
    description: category.seoDescription || category.description || category.name,
    path: `/category/${category.slug}/feed/`,
    entries: postsInCategory(slug),
  });
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
