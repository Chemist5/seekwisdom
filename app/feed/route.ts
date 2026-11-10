import { posts, site } from "@/lib/content";
import { renderFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  const xml = renderFeed({
    title: `${site.name} - "${site.tagline}"`,
    description: site.homeDescription,
    path: "/feed/",
    entries: posts,
  });
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
