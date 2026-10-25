import { resolveVideo } from '../lib/video';
import type { ChannelId } from './channels';

export type Pattern = 'stripes' | 'rings' | 'grid' | 'tunnel' | 'scan' | 'bars';

export type Work = {
  slug: string;
  title: string;
  year: number;
  kind: ChannelId;
  /** Video: the normal Vimeo or YouTube link, as copied from the browser. */
  video?: string;
  /** Main image, a path under /public (e.g. /media/images/x.webp). */
  src?: string;
  /** Extra images, e.g. installation views. */
  gallery?: string[];
  /** Grid thumbnail. Optional — falls back to `src`, then to the video's thumbnail. */
  thumb?: string;
  /** Override the frame shape, e.g. "4 / 3". Videos default to their real shape. */
  aspect?: string;
  /** Equipment / process, e.g. "Video synthesizer, CRT rescan, VHS". */
  medium?: string;
  /** Tape/format/resolution, e.g. "PAL 4:3 · Hi8". */
  format?: string;
  duration?: string;
  /** Where an installation was shown. */
  location?: string;
  description?: string;
  /** Test pattern shown while there is no media yet. */
  pattern?: Pattern;
};

/** A work with its video link resolved into an embeddable player. */
export type ResolvedWork = Work & { embed?: string };

// PLACEHOLDERS — replace with real work. Entries without media show a test pattern.
export const works: Work[] = [
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    year: 2026,
    kind: 'video',
    medium: 'Video synthesizer, camera feedback',
    format: 'PAL 4:3',
    duration: '06:12',
    pattern: 'rings',
    description: 'Placeholder. Set `video` to a Vimeo or YouTube link.',
  },
  {
    slug: 'tracking-error',
    title: 'Tracking Error',
    year: 2025,
    kind: 'video',
    medium: 'VHS, time base corrector',
    format: 'PAL 4:3 · VHS',
    duration: '03:40',
    pattern: 'scan',
    description: 'Placeholder.',
  },
  {
    slug: 'colour-burst',
    title: 'Colour Burst',
    year: 2024,
    kind: 'video',
    medium: 'Analog keyer, oscillators',
    format: 'PAL 4:3 · Hi8',
    duration: '09:05',
    pattern: 'bars',
    description: 'Placeholder.',
  },
  {
    slug: 'phosphor-study-01',
    title: 'Phosphor Study 01',
    year: 2025,
    kind: 'image',
    medium: 'CRT rescan, still capture',
    format: 'Archival pigment print · 1890 × 2835 px',
    pattern: 'stripes',
    description: 'Placeholder. Put an image in public/media/images and set `src`.',
  },
  {
    slug: 'phosphor-study-02',
    title: 'Phosphor Study 02',
    year: 2025,
    kind: 'image',
    medium: 'CRT rescan, still capture',
    format: 'Archival pigment print · 1890 × 2835 px',
    pattern: 'grid',
    description: 'Placeholder.',
  },
  {
    slug: 'vanishing-line',
    title: 'Vanishing Line',
    year: 2024,
    kind: 'image',
    medium: 'Scan processor, long exposure',
    format: 'Digital still · 4:3',
    pattern: 'tunnel',
    description: 'Placeholder.',
  },
  {
    slug: 'feedback-room',
    title: 'Feedback Room',
    year: 2026,
    kind: 'installation',
    medium: 'Closed-circuit cameras, 9 CRT monitors, video mixer',
    location: 'Placeholder venue',
    pattern: 'tunnel',
    description: 'Placeholder. Visitors walk into a camera loop and become part of the feedback.',
  },
  {
    slug: 'monitor-garden',
    title: 'Monitor Garden',
    year: 2025,
    kind: 'installation',
    medium: 'Motion sensor, oscillators, 16 CRT monitors',
    location: 'Placeholder venue',
    pattern: 'rings',
    description: 'Placeholder.',
  },
  {
    slug: 'sync-pulse',
    title: 'Sync Pulse',
    year: 2024,
    kind: 'installation',
    medium: 'Heart-rate sensor, video synthesizer',
    location: 'Placeholder venue',
    pattern: 'scan',
    description: 'Placeholder.',
  },
];

export async function resolveWork(work: Work): Promise<ResolvedWork> {
  if (!work.video) return { ...work, thumb: work.thumb ?? work.src };
  const v = await resolveVideo(work.video);
  return {
    ...work,
    embed: v.embed,
    thumb: work.thumb ?? work.src ?? v.thumb,
    aspect: work.aspect ?? v.aspect,
  };
}

export const resolvedWorks = (): Promise<ResolvedWork[]> => Promise.all(works.map(resolveWork));

export const worksIn = async (kind: ChannelId) => (await resolvedWorks()).filter((w) => w.kind === kind);
