# Cyborg Jungle

Portfolio site for Cyborg Jungle, analog video art, shown like channels on an old television.

**Live:** [cyborg-jungle.vercel.app](https://cyborg-jungle.vercel.app) · **Stack:** Astro, Pages CMS, Vercel

## What it does

- Shows the work as TV channels: **CH.01** images, **CH.02** video and **CH.03** interactive installations.
- The work itself is fully analog: video runs through a chain of analog video mixers and effect modules onto a CRT monitor, and the CRT is filmed with a phone. Stills are frames from that footage.
- Plays variations of one image as a slideshow, and gives a work without media a generated test pattern.
- Has an About page with a contact form that sends straight to the artist's inbox.

## How it's built

- [Astro](https://astro.build) with content stored as Markdown collections, type-checked against a schema (`src/content.config.ts`).
- Content is edited without code in [Pages CMS](https://app.pagescms.org): every save is a commit, and Vercel redeploys the site in about a minute.
- Videos stay on Vimeo or YouTube. Paste the normal link and the site finds the player, thumbnail and aspect ratio.
- Images are turned into web-sized WebP versions at build time, so full-size exports can go straight into the CMS.
- Mobile first: about 95% of visitors use a phone, so everything is designed at 375px first.
- The look follows the "NEO TOKYO" design language in [DESIGN.md](DESIGN.md), with tokens in `src/styles/tokens.css`.

## Run it locally

```bash
nvm use        # Node 24 (see .nvmrc)
npm install
npm run dev    # http://localhost:4321
```

## Editing content (Pages CMS)

Content is edited at **https://app.pagescms.org** (sign in with GitHub and open this repository).
Every save is a commit to `main`, and Vercel redeploys the site in about a minute.

- **Works** — one entry per work, stored as `src/content/works/<title>.md`.
  - *Channel*: Image (CH.01), Video (CH.02) or Interactive installation (CH.03).
  - *Video link*: paste the normal Vimeo/YouTube link; the site finds the player, thumbnail and
    aspect ratio. Unlisted works; embedding must be allowed. Never upload video files.
  - *Main image* / *Extra images*: JPEG, PNG or WebP. Uploads go to `src/assets/media/` and the site
    makes web-sized WebP versions at build time, so full-size exports are fine (keep them under ~10 MB).
  - *Play as slideshow*: for variations of one image. The main image and extra images cycle on
    the home wall and the work page; *Seconds per image* sets the speed (default 1).
  - Without media a work shows a generated test pattern.
  - *Preview frame*: the frame shown on the series' card (the number from the counter on the
    project page, e.g. `06 / 22` → 6). Channel-page slideshows start on it.
  - *Image description*: one sentence of alt text for screen readers and search.
- **About page** — name, details, portrait, bio and live photos (`src/content/about.json`).

Media files are named `<project>-<frame>-<original IMG number>.jpg`, e.g. `eye-band-01-8546.jpg`,
so every file traces back to the original export.

Field definitions live in `.pages.yml`; the matching schema is `src/content.config.ts`.

## Contact form

The form on the About page (`/about#contact`) sends messages to **cyborgjungle@gmail.com** through
[FormSubmit](https://formsubmit.co) (free, no account). The very first message triggers a one-time
activation email from FormSubmit to that inbox: click the link in it, and from then on every message
is delivered. A hidden honeypot field filters simple spam bots. To hide the address from the page
source, replace it in `src/pages/about.astro` with the random alias FormSubmit gives you after activation.

## Fonts

- Logo: **Aliens Among Us** by Darrell Flood (`public/fonts/aliens-among-us.woff`). Free for personal
  use; commercial use needs a licence (see the font's license.txt). The file is served publicly with the site.
- Dela Gothic One, DotGothic16 and Zen Kaku Gothic New: SIL Open Font License, via @fontsource.

## Media hosting limits

- GitHub rejects files over 100 MB and wants repos to stay small (under ~1 GB).
- Vercel Hobby (free) includes 100 GB/month of bandwidth for the whole site. Video eats that fast.
- Vercel Hobby is for non-commercial use only — selling work or taking commissions through the site needs Pro.

## About

A personal project by [CyborgJungle](https://github.com/CyborgJungle), built with [Claude Code](https://claude.com/claude-code) and hosted on [Vercel](https://vercel.com). It is shared as part of my portfolio: feel free to copy it and make it your own.

## License

The code is MIT licensed, see [LICENSE](LICENSE). The artwork (images and video stills in `src/assets/media/`, and the portrait and photos on the About page) is © Cyborg Jungle, all rights reserved, and is not covered by that licence. The logo font has its own licence (see Fonts).
