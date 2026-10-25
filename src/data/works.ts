export type Work = {
  slug: string;
  title: string;
  year: number;
  kind: 'video' | 'image';
  /** Grid thumbnail: a path under /public (e.g. /media/images/x.webp) or a full URL. */
  thumb?: string;
  /** Image: the full-size image. Video: a direct .mp4/.webm URL (e.g. from R2 or Blob). */
  src?: string;
  /** Video hosted on YouTube/Vimeo: the player embed URL. Takes priority over `src`. */
  embed?: string;
  /** Equipment / process, e.g. "Video synthesizer, CRT rescan, VHS". */
  medium?: string;
  description?: string;
};

// Placeholder entries — replace with real work. Entries without media show test bars.
export const works: Work[] = [
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    year: 2026,
    kind: 'video',
    medium: 'Video synthesizer, feedback loop',
    description: 'Placeholder. Add an `embed` URL (Vimeo/YouTube) or a `src` file URL.',
  },
  {
    slug: 'phosphor-study-01',
    title: 'Phosphor Study 01',
    year: 2025,
    kind: 'image',
    medium: 'CRT rescan, still capture',
    description: 'Placeholder. Put an image in public/media/images and set `src` and `thumb`.',
  },
  {
    slug: 'tracking-error',
    title: 'Tracking Error',
    year: 2025,
    kind: 'video',
    medium: 'VHS, time base corrector abuse',
  },
  {
    slug: 'canopy-sync',
    title: 'Canopy Sync',
    year: 2024,
    kind: 'image',
    medium: 'Analog keyer, camera feedback',
  },
];
