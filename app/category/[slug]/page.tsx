import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveHref } from "@/components/Archive";
import { TermArchive } from "@/components/TermArchive";
import { categories, getCategory, postsInCategory } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: { absolute: category.seoTitle },
    description: category.seoDescription || category.description || undefined,
    alternates: { canonical: `/category/${category.slug}/` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const items = postsInCategory(slug);
  return (
    <TermArchive
      kicker="Category"
      title={category.name}
      description={category.description}
      posts={items}
      page={1}
      hrefFor={(page) => archiveHref(`/category/${category.slug}/`, page)}
    />
  );
}
