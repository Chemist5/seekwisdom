import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmailForm } from "@/components/EmailForm";
import { Trending } from "@/components/Trending";
import { formatDate, getEntry, orderedCategories, pages, posts, site } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...posts, ...pages].map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: { absolute: entry.seoTitle },
    description: entry.seoDescription,
    alternates: { canonical: `/${entry.slug}/` },
    openGraph: {
      title: entry.seoTitle,
      description: entry.seoDescription,
      url: `/${entry.slug}/`,
      type: entry.type === "post" ? "article" : "website",
      images: entry.featuredImage ? [{ url: entry.featuredImage, alt: entry.featuredAlt }] : undefined,
    },
  };
}

export default async function EntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  return (
    <main id="main">
      {entry.type === "post" ? (
        <header className="hero">
          {entry.featuredImage ? (
            <Image
              className="media"
              src={entry.featuredImage}
              alt={entry.featuredAlt || ""}
              fill
              priority
              sizes="100vw"
            />
          ) : null}
          <span className="shade" aria-hidden="true" />
          <div className="hero-copy">
            <h1>{entry.title}</h1>
            <div className="meta">
              <Link href={`/author/${site.author.slug}/`}>{site.author.name}</Link>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
              {entry.categories.length > 0 ? (
                <span>
                  {orderedCategories(entry.categories).map((category, index) => (
                    <span key={category.slug}>
                      {index > 0 ? ", " : null}
                      <Link href={`/category/${category.slug}/`}>{category.name}</Link>
                    </span>
                  ))}
                </span>
              ) : null}
            </div>
          </div>
        </header>
      ) : null}
      <article className={entry.type === "page" ? "article-wrap page-content" : "article-wrap"}>
        <div
          className="entry-content"
          dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
        />
        {entry.slug === "contact" ? (
          <div className="contact-form">
            <EmailForm
              to={site.email}
              subject="Seek Wisdom contact"
              submitLabel="Submit"
              fields={["name", "email", "message"]}
            />
          </div>
        ) : null}
        {entry.type === "post" && entry.tags.length > 0 ? (
          <p className="meta">
            {entry.tags.map((tag, index) => (
              <span key={tag.slug}>
                {index > 0 ? ", " : null}
                <Link href={`/tag/${tag.slug}/`}>{tag.name}</Link>
              </span>
            ))}
          </p>
        ) : null}
      </article>
      <Trending />
    </main>
  );
}
