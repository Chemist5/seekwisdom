import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { absolute: site.homeTitle },
  description: site.homeDescription,
  applicationName: site.name,
  alternates: {
    types: { "application/rss+xml": "/feed/" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.homeTitle,
    description: site.homeDescription,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.homeTitle,
    description: site.homeDescription,
  },
  icons: {
    icon: [
      {
        url: "/wp-content/uploads/2023/03/cropped-Seek-Wisdom-Logo-2-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/wp-content/uploads/2023/03/cropped-Seek-Wisdom-Logo-2-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: "/wp-content/uploads/2023/03/cropped-Seek-Wisdom-Logo-2-180x180.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header name={site.name} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
