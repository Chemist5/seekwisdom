import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Videos - Seek Wisdom" },
  description: "Positive affirmation videos are coming to Seek Wisdom.",
  alternates: { canonical: "/videos/" },
  robots: { index: true, follow: true },
};

export default function VideosPage() {
  return (
    <main id="main" className="videos">
      <h1>Videos</h1>
      <p>Positive affirmation videos are coming soon.</p>
    </main>
  );
}
