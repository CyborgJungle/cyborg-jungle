# NEO TOKYO — Cyborg Jungle design language

The reference for every build of this site. Tokens live in `src/styles/tokens.css`;
this document explains what they are for and the rules for using them.

## Concept

**Neo-Tokyo cyber Bauhaus.** A black ground, cream ink and flat Bauhaus spot colours, with
constructed Japanese glyphs and vertical katakana, as on a wall of retro Japanese type posters.
Analog video shows up as TV-set frames, colour bars and signal glitches: misregistered type,
RGB-split images, slices of picture slipping sideways.

It sits between the site's first version (cyber HUD on black) and its second (Japanese print on
paper): the darkness and glitch of the first, the print graphics and restraint of the second.

| Source | What we take |
|---|---|
| Constructed kanji posters (black, cream, red dots) | The glyph system: radicals built from bars, arcs and dots, always with a coloured dot |
| Retro poster grids (red, teal, mustard, plum, lime on black) | Poster cards in a rotating spot palette |
| *The Pictograms* cover (neon green on black) | Mint as the cyber accent: labels, focus, small highlights |
| Vertical poster type | Katakana and Japanese names set vertically (`tategaki`) |
| The artist's own CRT work | Glitches, on images and display type only |

**Rules of restraint:** no filter or overlay across the whole page; glitches live on images and
display type. No blue HUD, crosshair, timecode or boot screen.

## Colour

Dark only, by design.

| Token | Hex | Role |
|---|---|---|
| `--void` | `#0b0a09` | Page background; ink on light poster cards. |
| `--panel` | `#171513` | Raised dark surfaces, dark poster card. |
| `--cream` | `#efe6cf` | Text, TV bezels, glyph strokes on dark. |
| `--cream-soft` | `#a39b8b` | Secondary text and labels (7:1 on void). |
| `--rule` | `#3a3631` | Hairline rules on void. |
| `--red` | `#ec3b2c` | Signal dot, Image channel, glitch channel A. |
| `--mint` | `#36f2a8` | Cyber accent: small labels, focus ring, katakana under the logo, glitch channel B. |
| `--teal` `--mustard` `--plum` `--lime` | `#1fa08f` `#e0ad1f` `#8a55b0` `#c3d633` | Bauhaus spot colours for cards, channels, glyph dots. |

Channel colours: ① Image red · ② Video teal · ③ Interactive mustard · ④ About plum.

**Poster palette** (`POSTERS` in `src/data/works.ts`): cream, red, teal, mustard, panel, plum,
lime, each with its ink (void or cream) and dot accent. A work's card colour is fixed by its place
in the site order, so it never changes between pages.

## Type

| Token | Face | Role |
|---|---|---|
| `--font-logo` | **Aliens Among Us** (Darrell Flood) | The CYBORG JUNGLE logo only. Personal-use licence. |
| `--font-display` | Dela Gothic One | Titles, Japanese display (katakana, channel names), counters. Uppercase Latin. |
| `--font-pixel` | DotGothic16 | Labels and readouts: meta lines, counts, the katakana name. Dot-matrix, Latin + Japanese. |
| `--font-text` | Zen Kaku Gothic New (Latin) | Body text. |

Japanese faces load only the subsets the page uses (unicode-range), so phones fetch a few small files.

## Glyphs

`Glyph.astro` builds a kanji-like mark from a seed (the project slug or channel id):
- **Layouts** split the square like kanji do: left | right, top / bottom, left | (top / bottom),
  (left | right) / bottom.
- **Radicals**: bars (三), comb, box (口, with a dot), sun (日), gate (冂, with a dot), hook (乚),
  arch, ring (with a dot), dots, cross (十), sweep, stair, spiral.
- Large areas get heavy radicals, narrow ones light marks; every glyph has at least one dot.
- 12-unit strokes in `currentColor`; dots in `--accent` (red by default, the card's accent on cards).
- The same seed always gives the same glyph. Use one per project, one per channel, three in the footer.

## Shapes and marks

- **Logo** — `CYBORG JUNGLE` in Aliens Among Us with a red/mint offset; `サイボーグ・ジャングル`
  in mint DotGothic16 under the large version.
- **TV pictogram** (`.tv`) — 5px cream bezel (void on cards), 20px corners, faint scanlines *inside*
  the screen only.
- **Poster card** — a work: colour block, TV screen, vertical katakana down the right edge,
  glyph and English title below.
- **Tategaki** (`.tategaki`) — vertical Japanese: work titles in katakana, channel names
  (画像 映像 体験 紹介), 紹介 on About.
- **Circled numbers** — ① ② ③ ④ for channels; the current channel is a filled tab in its colour.
- **Channel disc** — big filled circle with the channel number.
- **Stamps** — outlined labels for tags and filters; filled in the channel colour when selected.
- **Dimension line** — `← 4:3 →` under a work's screen.

## Glitch

| Where | Effect |
|---|---|
| Display type | `.glitch-type`: red left / mint right text-shadow (2–3px). |
| Hero image | Every 6 s two slices of the picture slip sideways and split into RGB for ~0.4 s. |
| Slideshow cut | Each new frame lands with a 0.18 s RGB-split jolt. |
| Card hover (desktop) | Card lifts onto a cream offset block; the picture RGB-splits and jolts. |
| Glyph | `glitch` prop: red/mint drop-shadow offset (work page title glyph). |

All of it stops under `prefers-reduced-motion` (the hero slices are hidden).

## Motion and slideshows

Works with several frames are slideshows at **1 s per frame** (set per work in Pages CMS), only
while on screen, paused under reduced motion. The home page shows **still** cards and one hero
image; channel pages and work pages play the slideshows.

## Navigation

① Image `/image` · ② Video `/video` · ③ Interactive `/installations` · ④ About `/about`, each with
its Japanese name. Phones: a row of four 72px tabs under the logo. Wide screens: pills beside the logo.

## Mobile first

About 95% of visitors are on a phone; everything is designed and tested at 375px first.
- One card per row; two from 640px; three from 1000px.
- Tap targets ≥ 44px; slideshow controls 48px; filters and thumbnails swipe sideways.
- Card titles scale with the card (container query) so `SUBJECT861649` fits on one line.
- No horizontal scroll at any width.

## Content order and names

- Works sort by their **Order** field (1 first), then by date. Swan Signal (the ballet) is last.
- Portrait projects are named `Subject` + six digits; their katakana is 被写体 + the digits as kanji numerals.

## Where it lives in the code

| Piece | File |
|---|---|
| Tokens | `src/styles/tokens.css` |
| `.tv`, `.tategaki`, `.circled`, `.stamp`, `.label`, `.glitch-type`, logo @font-face | `src/styles/global.css` |
| Logo | `src/components/Wordmark.astro`, `public/fonts/aliens-among-us.woff` |
| Glyph generator | `src/components/Glyph.astro` |
| Header / channel menu | `src/components/Header.astro` |
| Poster card | `src/components/WorkTile.astro`, palette `POSTERS` in `src/data/works.ts` |
| Slideshow frames / timer / cut jolt | `src/components/Frames.astro`, `src/scripts/site.ts` |
| RGB-split SVG filter, footer | `src/layouts/Base.astro` |
| Hero (picked in Pages CMS) | `src/pages/index.astro`, `src/content/home.json` |
| Channel page, tag filter, empty state | `src/components/ChannelPage.astro` |
| Channels (labels, numbers, colours, Japanese) | `src/data/channels.ts` |
| Tag vocabulary | `src/data/tags.ts`, `.pages.yml` |
| Works / About content | `src/content/works/*.md`, `src/content/about.json`, schema `src/content.config.ts` |
| Uploaded images (resized at build) | `src/assets/media/` via `src/lib/media.ts` + `src/components/Img.astro` |
