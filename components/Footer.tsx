import Image from "next/image";
import Link from "next/link";
import { FooterNav, FooterSocials } from "@/components/Header";
import { formatDate, posts, site } from "@/lib/content";

export function Footer() {
  const latest = posts.slice(0, 3);
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <FooterSocials />
        <FooterNav />
      </div>
      <div className="footer-grid">
        <div className="footer-col">
          <h2>Popular Posts</h2>
          {latest.map((post) => (
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
        <div className="footer-col">
          <h2>About Us</h2>
          <ul className="category-list">
            <li>
              <Link href="/privacy-policy-2/">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/contact/">Contact Us</Link>
            </li>
          </ul>
          <h2 className="spaced-heading">Disclosure</h2>
          <p>
            <em>
              This site contains affiliate links, so we may earn a small commission when you make a
              purchase through links on our site at no additional cost to you. Thank you for your
              support.
            </em>
          </p>
        </div>
        <div className="footer-col">
          <p>
            Seek Wisdom is a new blog that aims to provide practical and actionable advice on
            self-help, health, technology, and ways to better your life.
          </p>
          <p>
            <strong>Physical Address</strong>
            <br />
            304 North Cardinal St.
            <br />
            Dorchester Center, MA 02124
          </p>
          <p>
            Website: <Link href="/">seekwisdom.co</Link>
            <br />
            Email: <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p className="fine">Copyright © 2026 - Seek Wisdom LLC</p>
        </div>
      </div>
    </footer>
  );
}
