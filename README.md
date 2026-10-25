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

## Adding work — Pages CMS

Content is edited at **https://app.pagescms.org** (sign in with GitHub, open `CyborgJungle/cyborg-jungle`).
Every save is a commit to `main`, and Vercel redeploys the site in about a minute.

- **Works** — one entry per work, stored as `src/content/works/<title>.md`.
  - *Channel*: Image (CH.01), Video (CH.02) or Interactive installation (CH.03).
  - *Video link*: paste the normal Vimeo/YouTube link; the site finds the player, thumbnail and
    aspect ratio. Unlisted works; embedding must be allowed. Never upload video files.
  - *Main image* / *Extra images*: JPEG, PNG or WebP. Uploads go to `src/assets/media/` and the site
    makes web-sized WebP versions at build time, so full-size exports are fine (keep them under ~10 MB).
  - Without media a work shows a generated test pattern.
- **About page** — name, details, portrait, bio and signal chain (`src/content/about.json`).

Field definitions live in `.pages.yml`; the matching schema is `src/content.config.ts`.

## Media hosting limits (why video lives elsewhere)

- GitHub rejects files over 100 MB and wants repos to stay small (under ~1 GB).
- Vercel Hobby (free) includes 100 GB/month of bandwidth for the whole site. Video eats that fast.
- Vercel Hobby is for non-commercial use only — selling work or taking commissions through the site needs Pro.
