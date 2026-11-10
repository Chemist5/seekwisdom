import { ArchiveBody, homeHref } from "@/components/Archive";
import { Sidebar } from "@/components/Sidebar";
import { posts } from "@/lib/content";

export default function HomePage() {
  return (
    <main id="main">
      <h1 className="sr-only">Seek Wisdom</h1>
      <div className="layout">
        <div className="with-sidebar">
          <ArchiveBody posts={posts} page={1} hrefFor={homeHref} />
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
