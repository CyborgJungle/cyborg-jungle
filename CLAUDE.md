# Cyborg Jungle site

- All visual work follows the SIGNAL design language in `DESIGN.md`; use the tokens in
  `src/styles/tokens.css`, never new literal colors or fonts.
- Content is edited by the artist in Pages CMS (`.pages.yml`): works in `src/content/works/*.md`,
  About in `src/content/about.json`, uploads in `src/assets/media/`. Keep `.pages.yml` and
  `src/content.config.ts` in sync when adding fields. Channels are in `src/data/channels.ts`.
- Node 24 (`nvm use`), Astro 7. Build with `npm run build`.
- Videos are embedded from Vimeo/YouTube; never commit video files.
