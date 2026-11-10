# Seek Wisdom

Advice Worth Following. Static Next.js version of the [Seek Wisdom](https://seekwisdom.co) blog, ready to deploy on Vercel.

The live WordPress site is unchanged. This project copies the published posts, pages, and images so the same permalinks can be served from Vercel after DNS is pointed here.

## Scripts

- `npm run dev` — local preview
- `npm run lint` — ESLint
- `npm run build` — static production build
- `python3 scripts/migrate.py` — re-fetch public WordPress content and images

Content lives in `content/site.json`. Images live under `public/wp-content/uploads/`.
