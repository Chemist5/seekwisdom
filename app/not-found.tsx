import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="videos">
      <h1>Page not found</h1>
      <p>
        That link does not match a post on Seek Wisdom. <Link href="/">Return home</Link>.
      </p>
    </main>
  );
}
