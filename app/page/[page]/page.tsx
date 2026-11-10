import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveBody, homeHref } from "@/components/Archive";
import { Sidebar } from "@/components/Sidebar";
import { pageCount, posts, site } from "@/lib/content";

type Props = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  const total = pageCount(posts.length);
  return Array.from({ length: Math.max(0, total - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return {
    title: { absolute: `${site.name} - Page ${page}` },
    description: site.homeDescription,
    alternates: { canonical: `/page/${page}/` },
  };
}

export default async function PagedHome({ params }: Props) {
  const { page } = await params;
  const number = Number(page);
  if (!Number.isInteger(number) || number < 2 || number > pageCount(posts.length)) {
    notFound();
  }
  return (
    <main id="main">
      <h1 className="sr-only">Seek Wisdom, page {number}</h1>
      <div className="layout">
        <div className="with-sidebar">
          <ArchiveBody posts={posts} page={number} hrefFor={homeHref} />
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
