import { getTag, postsWithTag, site, tags } from "@/lib/content";
import { renderFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function generateStaticParams() {
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const tag = getTag(slug);
  if (!tag) return new Response("Not found", { status: 404 });
  const xml = renderFeed({
    title: `${tag.name} - ${site.name}`,
    description: tag.seoDescription || tag.description || tag.name,
    path: `/tag/${tag.slug}/feed/`,
    entries: postsWithTag(slug),
  });
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
