export type TermRef = {
  id: number;
  slug: string;
  name: string;
};

export type Term = TermRef & {
  description: string;
  count: number;
  seoTitle: string;
  seoDescription: string;
};

export type Entry = {
  id: number;
  slug: string;
  type: "post" | "page";
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  contentHtml: string;
  plainText: string;
  featuredImage: string | null;
  featuredAlt: string;
  featuredWidth: number | null;
  featuredHeight: number | null;
  categories: TermRef[];
  tags: TermRef[];
  seoTitle: string;
  seoDescription: string;
};

export type SiteInfo = {
  name: string;
  tagline: string;
  url: string;
  email: string;
  homeTitle: string;
  homeDescription: string;
  author: {
    name: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
  };
  logo: string;
  sidebarPosts: string[];
  trending: string[];
};

export type SiteData = {
  site: SiteInfo;
  posts: Entry[];
  pages: Entry[];
  categories: Term[];
  tags: Term[];
};
