import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveHref } from "@/components/Archive";
import { TermArchive } from "@/components/TermArchive";
import { getTag, postsWithTag, tags } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) return {};
  return {
    title: { absolute: tag.seoTitle },
    description: tag.seoDescription || tag.description || undefined,
    alternates: { canonical: `/tag/${tag.slug}/` },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) notFound();
  return (
    <TermArchive
      kicker="Tag"
      title={tag.name}
      description={tag.description}
      posts={postsWithTag(slug)}
      page={1}
      hrefFor={(page) => archiveHref(`/tag/${tag.slug}/`, page)}
    />
  );
}
