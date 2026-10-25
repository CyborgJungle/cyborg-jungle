# SIGNAL — Cyborg Jungle design language

The reference for every build of this site. Tokens live in `src/styles/tokens.css`;
this document explains what they are for and the rules for using them.

## Concept

**The site is a monitoring station for an analog video artist.** Visitors don't browse
pages, they *tune channels* on a wall of CRT monitors and read the output on an
operator's HUD. Every visual decision comes from that world: phosphor screens, test
patterns, signal-flow diagrams, technical spec sheets, surveillance overlays and
broken transmissions.

Five sources feed it:

| Source | What we take |
|---|---|
| Monitor wall (blue CRT screens of test patterns) | Rounded CRT screen shape, monochrome phosphor blue, op-art test patterns as placeholders |
| Technical poster (Swiss spec sheet) | Spec annotations as captions (`1890 × 2835 px`, `#bab9ad`), crosshair `+` registration marks, index numbers, barcode rules |
| Cyber HUD (glowing panel UI) | Framed panels with corner nodes, `//FIELD_` label rows, tick rulers, dot-matrix meters |
| Circuit traces / man-machine interface | Blue traces with round nodes linking things, numbered callouts, block diagrams of the signal chain |
| Glitch portrait / thermal crowd | RGB channel split, slice displacement on hover, thermal palette and labelled bounding boxes (`TARGET_03XX`) |

**Not used:** the references themselves. They are moodboard only and never appear on the site.

## Color

One theme: dark. The site is a screen in a dark room; there is no light mode by design.

| Token | Hex | Role |
|---|---|---|
| `--void` | `#04060c` | Page background. Blue-black, never pure black. |
| `--panel` | `#081022` | Panel and screen fill. |
| `--line` | `#1a2a4a` | Hairlines, panel borders, grid. |
| `--ink` | `#d6e4ff` | Primary text. Cool white. |
| `--dim` | `#6a7ca3` | Secondary text, labels, captions. |
| `--phosphor` | `#3d7bff` | Main accent: traces, active states, links. The "signal". |
| `--glow` | `#8fdcff` | Highlights and glow on top of phosphor. Use for text-shadow / box-shadow, rarely as fill. |
| `--signal` | `#ff715e` | Coral. Registration marks only. |
| `--thermal` | `#ffd23f` | Bounding boxes and their labels. Nothing else. |
| `--paper` | `#bab9ad` | Warm spec-sheet grey. Only for small swatches and spec text on the About page. |

### Channel colours

Each channel tunes the interface to its own hue, taken from the references (riso print, thermal
camera, RGB glitch). It is set once as `--ch` on a channel's elements and everything inside follows.

| Token | Hex | Channel | Source |
|---|---|---|---|
| `--ch-image` | `#ff4fa3` | CH.01 Image | Riso pink |
| `--ch-video` | `#2ee6c9` | CH.02 Video | Thermal cold end |
| `--ch-installation` | `#ff8a3d` | CH.03 Interactive | Thermal hot end |
| `--ch-about` | `#a98bff` | CH.04 About | Glitch violet |

`--ch` colours: channel numbers (nav, tuner, channel page), the active nav border and glow, `CH.0n`
tags on tiles, test-pattern placeholders, HUD panel corner nodes, circuit traces, hover states on a
work page. The About page's signal chain cycles through all of them, one per stage. A 2px
**colour burst** strip (all channel colours plus phosphor, thermal and coral, unequal widths like a
test card) runs under the HUD bar.

Rules:
- Phosphor blue carries the shared interface (wordmark accents, rulers, meters); channel colours
  carry everything that belongs to a channel. Coral is for registration marks only; yellow appears
  on lock-on (hover/focus) and the About page's subject frame only.
- Text stays `--ink` / `--dim`; channel colours are for numbers, marks, borders and hover, not body text.
- Images and video stay in their own colors. The interface tints placeholders only.
- Glow is always `--glow` at low alpha: `0 0 12px rgb(143 220 255 / .35)`.

## Type

| Token | Face | Role |
|---|---|---|
| `--font-display` | Chakra Petch 600/700, uppercase | Wordmark, page titles, work titles. Squared HUD letterforms. Tracking `0.04–0.12em`. |
| `--font-mono` | JetBrains Mono 400/500 | Everything else: body, nav, labels, metadata. |
| `--font-crt` | VT323 | Big readouts only: channel numbers, timecode, counters. |

All fonts are self-hosted (`@fontsource`), so the site makes no request to Google.

Scale (`--step-*`): `0.75 / 0.875 / 1 / 1.25 / 1.75 / 2.5 / clamp(3rem, 9vw, 7rem)` rem.
Body is `--step-0` (15px base) at line-height 1.6, max 65ch.

Label syntax, used everywhere metadata appears:

```
//YEAR_        2025
//MEDIUM_      Video synthesizer, CRT rescan
//FORMAT_      PAL 4:3 · 720×576
```

Uppercase, `//` prefix, `_` suffix, `--dim` color, `0.1em` tracking. Values in `--ink`.

## Shape & surface

- **CRT screen** (`.crt`): rounded rectangle with bulged corners (`border-radius: 6% / 9%`),
  inner vignette, scanlines, faint glow. Every thumbnail and media frame is a CRT screen.
- **HUD panel** (`.panel`): 1px `--line` border, square corners, a small filled square node on
  each corner. Holds metadata, never imagery.
- **Registration mark** (`.reg`): a coral `+` that sits on the corners of key compositions
  (hero, about card). At most four per view.
- **Tick ruler**: thin bottom rule with ticks every 8px, longer every 40px, and labels at
  the ends (`0000` … `2026`). Used under section headers.
- No drop shadows, no rounded cards outside CRT screens, no gradients except the CRT vignette.

## Texture

Texture lives **inside screens only**; the page itself stays clean (no full-page overlay).
1. **Scanlines** — inside every CRT screen, 1px dark line every 3px, ~22% alpha, plus the vignette.
2. **Halftone** — dot pattern over the About portrait (`radial-gradient` dots).

## Motion

Motion means *signal behaviour*. Each effect has a reason in the analog world.

| Moment | Effect | Duration |
|---|---|---|
| First visit | **Power-on**: a white line expands vertically into the screen, boot log types out, then the UI appears. Once per session; click/key skips. | ≈1.4 s |
| Page change | **Channel switch**: the page collapses to a line like a CRT switching off, then flickers on (View Transitions). | 400 ms |
| Hover a work | **Lock-on**: yellow bounding box snaps around it with a `TARGET_03XX` label; the image RGB-splits and slice-jitters for a moment. | 120 ms in |
| Pointer | **Crosshair cursor** with live `X/Y` readout (fine pointers only). | — |
| Always | HUD **timecode** runs at 25 fps (PAL), signal meter flickers. | — |

`prefers-reduced-motion: reduce` disables power-on, the channel switch and jitter; content is
never hidden behind an animation.

## Navigation — channels

The menu is a channel selector. Numbers are fixed; they are also keyboard shortcuts.

| Key | Channel | Path |
|---|---|---|
| `1` | CH.01 IMAGE | `/image` |
| `2` | CH.02 VIDEO | `/video` |
| `3` | CH.03 INTERACTIVE (installations) | `/installations` |
| `4` | CH.04 ABOUT | `/about` |
| `0` | MONITOR WALL (home) | `/` |

On work pages, `←` / `→` step through the channel's works.

## Voice

Terse operator language for interface labels (`SIGNAL ACQUIRED`, `NO SIGNAL`, `CH.02`).
Plain, human sentences for the art itself: titles, descriptions and the bio are never
written in jargon.

## Layout

- Persistent HUD bar on top (wordmark · channels · timecode). On phones the channels become a
  four-button remote along the bottom.
- Home is the **monitor wall**: the newest work as a 2×2 lead screen, then a regular grid of CRT
  screens mixing all channels (no other span sizes, so rows always pack evenly).
- Channel pages: header with big CRT channel number, count and tick ruler, then a grid of screens.
- Work page: big screen on the left, spec panel on the right (`//FIELD_` rows), linked by a
  circuit trace; prev/next below. Stacks on phones.
- Max content width 1440px; gutters `max(16px, 3vw)`.

## Where it lives in the code

| Piece | File |
|---|---|
| Tokens | `src/styles/tokens.css` |
| `.crt`, `.panel`, `.reg`, `.ruler`, `.label`, scanlines | `src/styles/global.css` |
| HUD bar + phone remote | `src/components/Hud.astro` |
| Power-on, channel switch, static, crosshair keyframes | `src/layouts/Base.astro` |
| Timecode, static noise, crosshair, keyboard remote | `src/scripts/hud.ts` |
| CRT tile with lock-on + RGB split | `src/components/WorkTile.astro` |
| Generated placeholder patterns | `src/components/TestPattern.astro` |
| Channels (labels, numbers, keys, colours) | `src/data/channels.ts` |
| Works (one Markdown file each, edited in Pages CMS) | `src/content/works/*.md`, schema in `src/content.config.ts` |
| About page content | `src/content/about.json` |
| Uploaded images (resized at build) | `src/assets/media/` via `src/lib/media.ts` + `src/components/Img.astro` |
| CMS fields | `.pages.yml` |
