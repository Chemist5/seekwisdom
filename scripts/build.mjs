import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public");
const siteName = "Seek Wisdom";
const tagline = "Advice Worth Following";
const origin = "https://seekwisdom.co";

const posts = JSON.parse(readFileSync(join(root, "content/posts.json"), "utf8"));
if (!Array.isArray(posts) || posts.length === 0) {
  throw new Error("No posts found in content/posts.json");
}

const slugs = new Set(posts.map((post) => post.slug));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripTags(html) {
  return String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

function excerptFor(post, limit = 150) {
  let text = stripTags(post.excerpt || post.content_html);
  const title = post.title.replace(/[“”"]/g, "").trim();
  if (text.toLowerCase().startsWith(title.toLowerCase())) {
    text = text.slice(title.length).replace(/^[:.\s-]+/, "");
  }
  text = text.replace(/^[^.?!]{10,80}:\s+/, "");
  text = text.replace(/\[\u2026\]|\u2026$/g, "").trim();
  if (text.length > limit) {
    text = `${text.slice(0, limit - 1).replace(/\s+\S*$/, "")}…`;
  }
  return text;
}

function rewriteInternalLinks(html) {
  return html.replace(
    /https?:\/\/(?:www\.)?seekwisdom\.co\/([^"'#?\s]+)\/?/gi,
    (match, path) => {
      const slug = decodeURIComponent(path).replace(/\/+$/, "").split("/").pop();
      return slugs.has(slug) ? `/${slug}/` : match;
    }
  );
}

function cleanContent(html) {
  let output = String(html ?? "");
  const proseBlocks = [
    ...output.matchAll(
      /<div class="[^"]*(?:markdown|prose)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
    ),
  ];
  if (proseBlocks.length) {
    output = proseBlocks.map((match) => match[1]).join("\n");
  }

  output = output
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "")
    .replace(/<span[^>]*>/gi, "")
    .replace(/<\/span>/gi, "");

  output = rewriteInternalLinks(output);
  output = output.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");
  output = output.replace(/<p>\s*<strong>\s*<\/strong>\s*<\/p>/gi, "");
  output = output.replace(/(<li[^>]*)\saria-level="\d+"/gi, "$1");
  return output.trim();
}

function write(path, contents) {
  const full = join(outDir, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents);
}

let signupCount = 0;

function signup(compact = false) {
  signupCount += 1;
  const fieldId = `email-${signupCount}`;
  return `
    <form class="signup" data-signup>
      <p class="sr-only">Email signup. Beehiiv comes later.</p>
      <div class="signup-row">
        <label class="sr-only" for="${fieldId}">Email</label>
        <input id="${fieldId}" name="email" type="email" autocomplete="email" placeholder="you@email.com" required>
        <button type="submit">Get the notes</button>
      </div>
      <p class="signup-note">${
        compact
          ? "Weekday mornings. Free. The real list is next."
          : "A short weekday email. Free. Beehiiv signup comes next — this is a preview."
      }</p>
    </form>
  `;
}

function layout({
  title,
  description,
  path,
  current,
  extraHead = "",
  content,
}) {
  const pageTitle = title === siteName ? `${siteName} — ${tagline}` : `${title} — ${siteName}`;
  const canonical = `${origin}${path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <link rel="icon" href="/assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/styles.css">
  ${extraHead}
</head>
<body>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="/">
        <img src="/assets/logo.png" alt="" width="80" height="80">
        <span class="brand-text">
          <span class="brand-name">${siteName}</span>
          <span class="brand-tag">${tagline}</span>
        </span>
      </a>
      <nav class="nav" aria-label="Primary">
        <a href="/"${current === "home" ? ' aria-current="page"' : ""}>Home</a>
        <a href="/posts/"${current === "posts" ? ' aria-current="page"' : ""}>Posts</a>
        <a href="/about/"${current === "about" ? ' aria-current="page"' : ""}>About</a>
      </nav>
    </div>
  </header>
  ${content}
  <footer class="site-footer">
    <div class="wrap footer-inner">
      <div>
        <div class="footer-brand">
          <img src="/assets/logo.png" alt="" width="64" height="64">
          <strong>${siteName}</strong>
        </div>
        <p class="fine-print">${tagline}. One person. Plain words. No fake office. No fake team.</p>
      </div>
      ${signup(true)}
    </div>
  </footer>
  <script src="/assets/site.js"></script>
</body>
</html>
`;
}

function card(post) {
  const image = post.featured_image
    ? `<div class="card-image"><img src="${escapeHtml(post.featured_image)}" alt="" loading="lazy" onerror="this.classList.add('is-missing')"></div>`
    : "";
  const category = post.categories?.[0]
    ? `<span class="pill">${escapeHtml(post.categories[0])}</span>`
    : "";
  return `
    <a class="card" href="/${encodeURI(post.slug)}/">
      ${image}
      <div class="card-body">
        <div class="meta">${category}<time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time></div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(excerptFor(post))}</p>
      </div>
    </a>
  `;
}

const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date));

write(
  "index.html",
  layout({
    title: siteName,
    description:
      "A short weekday email with one useful idea — before your day gets loud.",
    path: "/",
    current: "home",
    content: `
      <main>
        <section class="hero">
          <div class="wrap hero-copy">
            <h1>Advice worth following.</h1>
            <p>A short weekday email with one useful idea — before your day gets loud.</p>
            ${signup()}
          </div>
        </section>
        <section class="section">
          <div class="wrap">
            <div class="section-head">
              <h2>Latest posts</h2>
              <a href="/posts/">See all ${latest.length}</a>
            </div>
            <div class="cards">
              ${latest.slice(0, 6).map(card).join("")}
            </div>
          </div>
        </section>
      </main>
    `,
  })
);

write(
  "posts/index.html",
  layout({
    title: "Posts",
    description: "All Seek Wisdom posts, kept from the old site with the same slugs.",
    path: "/posts/",
    current: "posts",
    content: `
      <main class="page">
        <div class="wrap">
          <h1 class="page-title">All posts</h1>
          <p class="page-lead">${latest.length} notes on rest, writing, money stress, and getting through the day.</p>
          <div class="cards" style="margin-top:1.4rem">
            ${latest.map(card).join("")}
          </div>
        </div>
      </main>
    `,
  })
);

write(
  "about/index.html",
  layout({
    title: "About",
    description: "Seek Wisdom is a one-person brand. Short advice. No fake team.",
    path: "/about/",
    current: "about",
    content: `
      <main class="page">
        <div class="wrap prose">
          <h1 class="page-title">One person. Plain advice.</h1>
          <div class="about-block">
            <p>Seek Wisdom is me. I’m Jaime.</p>
            <p>I write short notes I want to follow myself. There is no team of experts. There is no office in Massachusetts. There is just a morning habit: one useful idea before the day gets loud.</p>
            <p>If you like calm words more than hype, you’re in the right place. The email is the main thing. The posts here are the library.</p>
          </div>
        </div>
      </main>
    `,
  })
);

write(
  "404.html",
  layout({
    title: "Page not found",
    description: "This page is not here.",
    path: "/404.html",
    current: "",
    content: `
      <main class="page">
        <div class="wrap prose">
          <h1 class="page-title">This page is not here.</h1>
          <p class="page-lead">Try the <a href="/posts/">posts list</a>, or go <a href="/">home</a>.</p>
        </div>
      </main>
    `,
  })
);

for (const post of latest) {
  const description = excerptFor(post, 160);
  const image = post.featured_image
    ? `<div class="post-hero"><img src="${escapeHtml(post.featured_image)}" alt="" onerror="this.classList.add('is-missing')"></div>`
    : "";
  const categories = (post.categories || [])
    .map((category) => `<span class="pill">${escapeHtml(category)}</span>`)
    .join("");

  write(
    `${post.slug}/index.html`,
    layout({
      title: post.title,
      description,
      path: `/${post.slug}/`,
      current: "posts",
      extraHead: post.featured_image
        ? `<meta property="og:image" content="${escapeHtml(post.featured_image)}">`
        : "",
      content: `
        <main class="page">
          <article class="wrap">
            ${image}
            <div class="meta">${categories}<time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time></div>
            <h1 class="page-title">${escapeHtml(post.title)}</h1>
            <div class="post-content">
              ${cleanContent(post.content_html)}
            </div>
            <p class="page-lead" style="margin-top:2rem"><a href="/posts/">← All posts</a></p>
          </article>
        </main>
      `,
    })
  );
}

const sitemapUrls = [
  "/",
  "/posts/",
  "/about/",
  ...latest.map((post) => `/${post.slug}/`),
];

write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (path) => `  <url>
    <loc>${origin}${path}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`
);

write(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
);

mkdirSync(join(outDir, "assets"), { recursive: true });
copyFileSync(join(root, "assets/styles.css"), join(outDir, "assets/styles.css"));
copyFileSync(join(root, "assets/site.js"), join(outDir, "assets/site.js"));
copyFileSync(join(root, "assets/logo.png"), join(outDir, "assets/logo.png"));

console.log(`Built Seek Wisdom with ${latest.length} migrated posts.`);
