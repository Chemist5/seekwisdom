# Seek Wisdom

Advice Worth Following. A static preview for a weekday morning email.

This is a **preview**. The live WordPress site on Bluehost stays put. No DNS changes.

## What’s here

- Home: one promise, email signup, then three latest notes
- Notes index plus 32 migrated WordPress posts (same slugs)
- Brand page (`/about/`): what this is — no personal bio
- `sitemap.xml`, `robots.txt`, and Vercel clean URLs

Featured images still hotlink from `seekwisdom.co` for now. The email form is a preview placeholder until Beehiiv.

## Local

```bash
npm run build
```

That writes static files to `public/`. Open `public/index.html` or serve the folder.

## Deploy

Vercel builds with `npm run build` and publishes `public/`. Preview only — do not point `seekwisdom.co` here until someone says yes.

## Content

WordPress export lives in `content/posts.json`. Re-run the build after you change it.
