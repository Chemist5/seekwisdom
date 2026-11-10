import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveHref } from "@/components/Archive";
import { TermArchive } from "@/components/TermArchive";
import { pageCount, posts, site } from "@/lib/content";

type Props = { params: Promise<{ slug: string; page: string }> };

export function generateStaticParams() {
  const total = pageCount(posts.length);
  return Array.from({ length: Math.max(0, total - 1) }, (_, index) => ({
    slug: site.author.slug,
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return {
    title: { absolute: `${site.author.name} - Page ${page}` },
    description: site.author.seoDescription || undefined,
    alternates: { canonical: `/author/${site.author.slug}/page/${page}/` },
  };
}

export default async function AuthorPaged({ params }: Props) {
  const { slug, page } = await params;
  const number = Number(page);
  if (slug !== site.author.slug) notFound();
  if (!Number.isInteger(number) || number < 2 || number > pageCount(posts.length)) notFound();
  return (
    <TermArchive
      kicker="Author"
      title={site.author.name}
      posts={posts}
      page={number}
      hrefFor={(next) => archiveHref(`/author/${site.author.slug}/`, next)}
    />
  );
}
