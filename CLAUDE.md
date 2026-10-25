# Cyborg Jungle site

- All visual work follows the NEO TOKYO design language in `DESIGN.md` (black cyber Bauhaus, mobile first); use the tokens in
  `src/styles/tokens.css`, never new literal colors or fonts.
- Content is edited by the artist in Pages CMS (`.pages.yml`): works in `src/content/works/*.md`,
  About in `src/content/about.json`, uploads in `src/assets/media/`. Keep `.pages.yml` and
  `src/content.config.ts` in sync when adding fields. Channels are in `src/data/channels.ts`.
- Node 24 (`nvm use`), Astro 7. Build with `npm run build`.
- Videos are embedded from Vimeo/YouTube; never commit video files.
- The artist's process is fully analog: video is fed through a chain of analog video mixers and
  effect modules onto a CRT monitor, and the CRT is filmed with a phone. Stills are frames from that
  footage. Describe the work this way; never as synthesised, digital, or "rescanned" stills.
- A project with several variations of one image is ONE work with a slideshow, not several works.
- Tags come from the fixed vocabulary in `src/data/tags.ts`; keep the `.pages.yml` picker in sync.
  Every work gets tags and an `alt` sentence. Slideshows default to 1 s per frame.
- About 95% of visitors use a phone: design and test at 375px first. Glitches go on images and
  display type only — never a filter or overlay across the whole page; no blue HUD.
- Works are ordered by their `order` field; portrait projects are named `Subject` + six digits.
