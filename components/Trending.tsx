import Image from "next/image";
import Link from "next/link";
import { trendingPosts } from "@/lib/content";

export function Trending() {
  const posts = trendingPosts();
  if (posts.length === 0) return null;
  return (
    <section className="trending" aria-label="Trending now">
      <div className="trending-inner">
        <h2>Trending now</h2>
        <div className="trending-row">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${post.slug}/`} className="trend">
              {post.featuredImage ? (
                <Image src={post.featuredImage} alt="" width={54} height={54} />
              ) : (
                <span />
              )}
              <span>{post.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
