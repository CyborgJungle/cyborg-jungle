# Cyborg Jungle

Portfolio site for Cyborg Jungle — analog video art. Built with [Astro](https://astro.build), deployed on Vercel.

## Run locally

```bash
nvm use        # Node 24 (see .nvmrc)
npm install
npm run dev    # http://localhost:4321
```

## Adding work

Edit `src/data/works.ts`. Each entry becomes a tile on the home page and its own page at `/work/<slug>`.

- **Images:** export web-sized files (WebP/AVIF/JPEG, ~2000px long edge, a few hundred KB) into
  `public/media/images/`, then set `thumb` and `src` to `/media/images/<file>`.
- **Video:** don't commit video files. Host them elsewhere and either
  - set `embed` to a Vimeo/YouTube player URL, or
  - set `src` to a direct `.mp4`/`.webm` URL from object storage (e.g. Cloudflare R2).

## Media hosting limits (why video lives elsewhere)

- GitHub rejects files over 100 MB and wants repos to stay small (under ~1 GB).
- Vercel Hobby (free) includes 100 GB/month of bandwidth for the whole site. Video eats that fast.
- Vercel Hobby is for non-commercial use only — selling work or taking commissions through the site needs Pro.
