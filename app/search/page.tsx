import type { Metadata } from "next";
import { ResultList } from "@/components/Archive";
import { Sidebar } from "@/components/Sidebar";
import { searchEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Search - Seek Wisdom" },
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ s?: string | string[] }> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.s;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").trim();
  const results = query ? searchEntries(query) : [];

  return (
    <main id="main">
      <div className="layout">
        <header className="archive-head">
          <h1>
            <span className="kicker">Search</span>
            {query || "What is it you Seek?"}
          </h1>
        </header>
        <div className="with-sidebar">
          <div>
            {query ? <ResultList posts={results} /> : <p className="empty">Type a word to search the blog.</p>}
          </div>
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
