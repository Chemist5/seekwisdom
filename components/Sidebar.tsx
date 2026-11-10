import Image from "next/image";
import Link from "next/link";
import { categoriesInNav, formatDate, sidebarPosts, site } from "@/lib/content";
import { EmailForm } from "@/components/EmailForm";

export function Sidebar() {
  const picks = sidebarPosts();
  const categories = categoriesInNav();
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="widget">
        <h2>What is it you Seek?</h2>
        <form className="search-form" action="/" method="get" role="search">
          <label className="sr-only" htmlFor="sidebar-search">
            Search
          </label>
          <input id="sidebar-search" type="search" name="s" placeholder="Search" />
          <button type="submit" aria-label="Search button">
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
              <path
                fill="currentColor"
                d="M14.8,13.7L12,11c0.9-1.2,1.5-2.6,1.5-4.2c0-3.7-3-6.8-6.8-6.8S0,3,0,6.8s3,6.8,6.8,6.8c1.6,0,3.1-0.6,4.2-1.5l2.8,2.8c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2C15.1,14.5,15.1,14,14.8,13.7z M1.5,6.8c0-2.9,2.4-5.2,5.2-5.2S12,3.9,12,6.8S9.6,12,6.8,12S1.5,9.6,1.5,6.8z"
              />
            </svg>
          </button>
        </form>
      </div>
      <div className="widget">
        <h2>Posts</h2>
        {picks.map((post) => (
          <Link key={post.slug} href={`/${post.slug}/`} className="mini-post">
            {post.featuredImage ? (
              <Image src={post.featuredImage} alt={post.featuredAlt || ""} width={64} height={64} />
            ) : (
              <span />
            )}
            <span>
              <strong>{post.title}</strong>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
          </Link>
        ))}
      </div>
      <div className="widget">
        <h2>Categories</h2>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/category/${category.slug}/`}>
                <span>{category.name}</span>
                <span>({category.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="widget">
        <figure className="pullquote">
          <blockquote>
            <p>&quot;Try not to become a man of success, but rather try to become a man of value.&quot;</p>
            <cite>Albert Einstein</cite>
          </blockquote>
        </figure>
      </div>
      <div className="widget">
        <h2>Seek Wisdom Newsletter</h2>
        <p>Subscribe now for exclusive self-help, health, and technology insights!</p>
        <EmailForm
          subject="Seek Wisdom Newsletter"
          submitLabel="Submit"
          fields={["name", "email"]}
          to={site.email}
        />
      </div>
    </aside>
  );
}
