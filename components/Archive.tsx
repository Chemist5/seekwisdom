import Image from "next/image";
import Link from "next/link";
import { formatDate, orderedCategories, pageCount, paginate } from "@/lib/content";
import type { Entry } from "@/lib/types";

export function PostCard({ post }: { post: Entry }) {
  return (
    <article className="entry-card">
      {post.featuredImage ? (
        <Image
          className="media"
          src={post.featuredImage}
          alt={post.featuredAlt || ""}
          fill
          sizes="(max-width: 720px) 100vw, 40vw"
        />
      ) : null}
      <span className="shade" aria-hidden="true" />
      <div className="card-copy">
        {post.categories.length > 0 ? (
          <ul className="pills">
            {orderedCategories(post.categories).map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}/`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        ) : null}
        <h2>
          <Link href={`/${post.slug}/`}>{post.title}</Link>
        </h2>
      </div>
    </article>
  );
}

export function Pagination({
  page,
  total,
  hrefFor,
}: {
  page: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const pages = pageCount(total);
  if (pages < 2) return null;
  const items = Array.from({ length: pages }, (_, index) => index + 1);
  return (
    <nav className="pagination" aria-label="Posts">
      {items.map((number) =>
        number === page ? (
          <span key={number} className="is-current" aria-current="page">
            {number}
          </span>
        ) : (
          <Link key={number} href={hrefFor(number)}>
            {number}
          </Link>
        ),
      )}
      {page < pages ? <Link href={hrefFor(page + 1)}>Next</Link> : null}
    </nav>
  );
}

export function PostGrid({ posts }: { posts: Entry[] }) {
  return (
    <div className="entries">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

export function ArchiveBody({
  posts,
  page,
  hrefFor,
}: {
  posts: Entry[];
  page: number;
  hrefFor: (page: number) => string;
}) {
  const visible = paginate(posts, page);
  return (
    <div>
      {visible.length === 0 ? <p className="empty">No posts yet.</p> : <PostGrid posts={visible} />}
      <Pagination page={page} total={posts.length} hrefFor={hrefFor} />
    </div>
  );
}

export function archiveHref(base: string, page: number): string {
  if (page <= 1) return base;
  return `${base}page/${page}/`;
}

export function homeHref(page: number): string {
  return page <= 1 ? "/" : `/page/${page}/`;
}

export function ResultList({ posts }: { posts: Entry[] }) {
  if (posts.length === 0) {
    return <p className="empty">No results.</p>;
  }
  return (
    <div className="result-list">
      {posts.map((post) => (
        <article key={post.slug} className="mini-post result">
          <Link href={`/${post.slug}/`}>
            {post.featuredImage ? (
              <Image src={post.featuredImage} alt={post.featuredAlt || ""} width={96} height={96} />
            ) : null}
          </Link>
          <div>
            <h2>
              <Link href={`/${post.slug}/`}>{post.title}</Link>
            </h2>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
