# Seek Wisdom

Advice Worth Following. A clean static site for the Seek Wisdom morning-habit brand.

This is a **preview**. The live WordPress site on Bluehost stays put. No DNS changes.

## What’s here

- Home with the hero, weekday-email idea, and a signup placeholder
- Posts index plus 32 migrated WordPress posts (same slugs)
- Honest About page (one person, no fake team, no fake address)
- `sitemap.xml`, `robots.txt`, and Vercel clean URLs

Featured images still hotlink from `seekwisdom.co` for now. Beehiiv is next; the email form is a preview-only placeholder.

## Local

```bash
npm run build
```

That writes static files to `public/`. Open `public/index.html` or serve the folder.

## Deploy

Vercel builds with `npm run build` and publishes `public/`. Preview only — do not point `seekwisdom.co` here until someone says yes.

Preview (PR branch, SSO-protected):
https://seekwisdom-1xi05dnjx-chemist5s-projects.vercel.app

Branch alias:
https://seekwisdom-git-cursor-seek-wisdom-sta-ee419d-chemist5s-projects.vercel.app

## Content

WordPress export lives in `content/posts.json`. Re-run the build after you change it.
