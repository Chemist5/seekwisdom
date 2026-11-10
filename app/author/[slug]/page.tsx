import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveHref } from "@/components/Archive";
import { TermArchive } from "@/components/TermArchive";
import { posts, site } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: site.author.slug }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== site.author.slug) return {};
  return {
    title: { absolute: site.author.seoTitle },
    description: site.author.seoDescription || undefined,
    alternates: { canonical: `/author/${site.author.slug}/` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  if (slug !== site.author.slug) notFound();
  return (
    <TermArchive
      kicker="Author"
      title={site.author.name}
      posts={posts}
      page={1}
      hrefFor={(page) => archiveHref(`/author/${site.author.slug}/`, page)}
    />
  );
}
