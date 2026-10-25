# Cyborg Jungle

Portfolio site for Cyborg Jungle — analog video art. Built with [Astro](https://astro.build), deployed on Vercel.

## Run locally

```bash
nvm use        # Node 24 (see .nvmrc)
npm install
npm run dev    # http://localhost:4321
```

## Design

The look and feel is documented in [DESIGN.md](DESIGN.md) (the "SIGNAL" design language) with
tokens in `src/styles/tokens.css`. Read it before changing anything visual.

## Adding work

Edit `src/data/works.ts`. Each entry becomes a CRT screen on the home page monitor wall, a tile on
its channel page, and its own page at `/work/<slug>`.

- `kind`: `image` (CH.01), `video` (CH.02) or `installation` (CH.03 Interactive).
- **Images:** export web-sized files (WebP/AVIF/JPEG, ~2000px long edge, a few hundred KB) into
  `public/media/images/`, then set `src` to `/media/images/<file>`.
- **Video:** upload to Vimeo or YouTube, then set `video` to the normal link you'd share
  (e.g. `https://vimeo.com/123456789` or `https://youtu.be/abc123`). At build time the site
  looks up the embeddable player, thumbnail and aspect ratio automatically. Unlisted videos
  work; the video must allow embedding. Don't commit video files to this repo.
- **Installations:** use `video` and/or `src` for the main view and `gallery` for extra photos.
- Optional details shown in the spec panel: `medium`, `format`, `duration`, `location`, `description`.
- Without any media, a work shows a generated test pattern (`pattern`).

The About page text is at the top of `src/pages/about.astro`.

## Media hosting limits (why video lives elsewhere)

- GitHub rejects files over 100 MB and wants repos to stay small (under ~1 GB).
- Vercel Hobby (free) includes 100 GB/month of bandwidth for the whole site. Video eats that fast.
- Vercel Hobby is for non-commercial use only — selling work or taking commissions through the site needs Pro.
