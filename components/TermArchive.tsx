import { ArchiveBody } from "@/components/Archive";
import { Sidebar } from "@/components/Sidebar";
import type { Entry } from "@/lib/types";

export function TermArchive({
  kicker,
  title,
  description,
  posts,
  page,
  hrefFor,
}: {
  kicker: string;
  title: string;
  description?: string;
  posts: Entry[];
  page: number;
  hrefFor: (page: number) => string;
}) {
  return (
    <main id="main">
      <div className="layout">
        <header className="archive-head">
          <h1>
            <span className="kicker">{kicker}</span>
            {title}
          </h1>
          {description ? <p>{description}</p> : null}
        </header>
        <div className="with-sidebar">
          <ArchiveBody posts={posts} page={page} hrefFor={hrefFor} />
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
