# TEST CARD — Cyborg Jungle design language

The reference for every build of this site. Tokens live in `src/styles/tokens.css`;
this document explains what they are for and the rules for using them.

## Concept

**Analog video, printed.** The site looks like a piece of Japanese retro print design about
television: black ink on warm paper, one red signal dot, bold geometric letterforms, and a few
spot colours. The analog video world shows up as *pictograms*, not as screen effects: TV-set
outlines around every image, test-card dot rings, colour bars, circled channel numbers and the
red power light.

The artworks are the only glitchy thing on the page. The interface stays flat, calm and printed
so the images carry the noise.

Sources it draws on:

| Source | What we take |
|---|---|
| Kanji-style display lettering (black strokes, red dots) | Heavy geometric display type, the red dot as the signature mark |
| Retro poster sets (cream, red, teal, mustard, plum on black) | The spot-colour palette and flat colour blocks |
| Packaging print (circled numbers, dimension arrows, stamp logos) | Circled numerals, dimension lines, outlined stamp labels |
| Pictogram heads with dot patterns | Test-card dot rings as the decorative motif |

**Not used:** screen-UI tropes. No blue HUD, no scanlines, no RGB colour offsets, no glow, no
crosshair, no timecode, no boot sequence, no monospace "code" labels. The reference images are
moodboard only and never appear on the site.

## Colour

One printed look: light paper. There is no dark mode by design.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#efe9dc` | Page background. Warm, uncoated paper. |
| `--paper-deep` | `#e3dccb` | Hover fills, quiet panels. |
| `--ink` | `#151413` | Text, rules, TV bezels, active states. |
| `--ink-soft` | `#5c574e` | Secondary text, labels, captions (5.8:1 on paper). |
| `--red` | `#e2412f` | The signal dot: the O in the wordmark, the centre of dot rings, the footer dot. |

### Channel colours

Flat spot colours, one per channel. Set once as `--ch` on a channel's elements.

| Token | Hex | Channel |
|---|---|---|
| `--ch-image` | `#e2412f` | ① Image — red |
| `--ch-video` | `#2f7f72` | ② Video — teal |
| `--ch-installation` | `#d9a21b` | ③ Interactive — mustard |
| `--ch-about` | `#6b3f6e` | ④ About — plum |

Rules:
- Ink carries the site. Colour appears as **filled shapes**: the circled channel numbers, the big
  channel disc, the dot before a work's channel name, the play button, the active thumbnail.
- Never set body text in a channel colour; mustard and teal fail contrast on paper as text.
- The artworks keep their own colours; the interface never tints, filters or overlays them.

## Type

| Token | Face | Role |
|---|---|---|
| `--font-display` | Dela Gothic One, uppercase | Wordmark, page titles, work titles, counters. Heavy and geometric, like the poster lettering. |
| `--font-text` | Zen Kaku Gothic New 400/500/700 | Everything else: body, menu, labels, captions. |

Self-hosted via `@fontsource`, **Latin subsets only** (fast on phones, no request to Google).

Scale: `0.75 / 0.875 / 1 / 1.25 / 1.625 / clamp(2–3rem) / clamp(3–7.5rem)` rem. Body is 16px at
line-height 1.6, max ~62ch. Labels: `--step--2`, weight 700, uppercase, 0.12em tracking, `--ink-soft`.

## Shapes and marks

- **Wordmark** — `CYB●RG JUNGLE`: the O is the red signal dot. Large and stacked on the home page,
  small in the header everywhere else. Never set the name with a plain O in display type.
- **TV pictogram** (`.tv`) — every image sits in a thick black bezel (6px) with 22px rounded
  corners: a television drawn as a pictogram. No scanlines or vignette inside.
- **Circled numbers** (`.circled`) — ① ② ③ ④ for channels; filled with the channel colour when active.
- **Channel disc** — the channel page opens with a big filled circle in the channel colour holding
  the number in display type.
- **Dot ring** (`DotRing.astro`) — concentric rings of ink dots around a red centre: the test card.
  Used once per page at most (home intro).
- **Colour bars** (`TestPattern` "bars") — the empty-channel state, in the spot palette.
- **Stamps** (`.stamp`) — tags and filters as outlined rounded labels; filled ink when selected.
- **Dimension line** — under a work's screen, arrows either side of the aspect ratio (`← 4:3 →`).
- **Rules** — 1.5px ink lines separate sections and spec rows. No shadows, no gradients.

## Motion

Almost none. The art moves; the interface doesn't.

| Moment | Behaviour |
|---|---|
| Slideshow work | Hard cut between frames every 0.8 s (set per work). Only while on screen; staggered across the page; the next frame is decoded before the cut so it never flashes black. Paused under reduced motion. Work pages add previous / pause / next (48px round buttons), a `01 / 37` counter and a swipeable thumbnail strip. |
| Hover (desktop) | A tile's TV bezel takes the channel colour; menu items get a paper-deep pill. |

No page transitions, intro screens or cursor effects.

## Navigation

The menu is four channels, numbered like a TV tuner. Keys `0–4` also jump (desktop).

| Channel | Path |
|---|---|
| ① Image | `/image` |
| ② Video | `/video` |
| ③ Interactive (installations) | `/installations` |
| ④ About | `/about` |

Phones: the four channels sit as a ruled row of equal tabs under the wordmark (64px tall).
Wider screens: a pill row to the right of the wordmark. The current channel is filled ink.

## Mobile first

About 95% of visitors are on a phone, so every layout starts at 375px wide.
- One column of works; two from 640px, three from 1000px (the newest work then spans 2×2).
- Tap targets at least 44px; slideshow controls 48px.
- Tag filters and thumbnails scroll sideways instead of wrapping into tall blocks.
- Images are resized at build (WebP, 480–1400px) and lazy-loaded; wall tiles preview 10 frames.
- No horizontal page scroll at any width; long display words scale with the viewport.

## Voice

Plain, warm, human. Labels are short and literal ("Previous", "37 frames", "No signal yet").
The art is described by what you see and how it was made; never in tech jargon.

## Where it lives in the code

| Piece | File |
|---|---|
| Tokens | `src/styles/tokens.css` |
| `.tv`, `.circled`, `.stamp`, `.label`, `.rule` | `src/styles/global.css` |
| Wordmark | `src/components/Wordmark.astro` |
| Header / channel menu | `src/components/Header.astro` |
| Work tile | `src/components/WorkTile.astro` |
| Slideshow frames / timer | `src/components/Frames.astro`, `src/scripts/site.ts` |
| Dot ring | `src/components/DotRing.astro` |
| Colour bars and placeholder patterns | `src/components/TestPattern.astro` |
| Channel page, tag filter, empty state | `src/components/ChannelPage.astro` |
| Channels (labels, numbers, colours) | `src/data/channels.ts` |
| Tag vocabulary (also the Pages CMS picker) | `src/data/tags.ts`, `.pages.yml` |
| Works (one Markdown file each, edited in Pages CMS) | `src/content/works/*.md`, schema in `src/content.config.ts` |
| About page content | `src/content/about.json` |
| Uploaded images (resized at build) | `src/assets/media/` via `src/lib/media.ts` + `src/components/Img.astro` |
