import { posts, site } from "@/lib/content";
import { renderFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ slug: site.author.slug }];
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (slug !== site.author.slug) return new Response("Not found", { status: 404 });
  const xml = renderFeed({
    title: `${site.author.name} - ${site.name}`,
    description: site.author.seoDescription || site.tagline,
    path: `/author/${site.author.slug}/feed/`,
    entries: posts,
  });
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
