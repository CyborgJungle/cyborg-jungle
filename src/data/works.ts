import { resolveVideo } from '../lib/video';

export type Work = {
  slug: string;
  title: string;
  year: number;
  kind: 'video' | 'image';
  /** Video: the normal Vimeo or YouTube link, as copied from the browser. */
  video?: string;
  /** Image: the full-size image, a path under /public (e.g. /media/images/x.webp). */
  src?: string;
  /** Grid thumbnail. Optional for videos — the Vimeo/YouTube thumbnail is used by default. */
  thumb?: string;
  /** Override the frame shape, e.g. "4 / 3". Videos default to their real shape. */
  aspect?: string;
  /** Equipment / process, e.g. "Video synthesizer, CRT rescan, VHS". */
  medium?: string;
  description?: string;
};

/** A work with its video link resolved into an embeddable player. */
export type ResolvedWork = Work & { embed?: string };

// Newest first. Entries without media show test bars.
export const works: Work[] = [
  {
    slug: 'signal-garden',
    title: 'Signal Garden',
    year: 2026,
    kind: 'video',
    medium: 'Video synthesizer, feedback loop',
    description: 'Placeholder. Set `video` to a Vimeo or YouTube link.',
  },
  {
    slug: 'phosphor-study-01',
    title: 'Phosphor Study 01',
    year: 2025,
    kind: 'image',
    medium: 'CRT rescan, still capture',
    description: 'Placeholder. Put an image in public/media/images and set `src`.',
  },
];

export async function resolveWork(work: Work): Promise<ResolvedWork> {
  if (!work.video) return { ...work, thumb: work.thumb ?? work.src };
  const v = await resolveVideo(work.video);
  return {
    ...work,
    embed: v.embed,
    thumb: work.thumb ?? v.thumb,
    aspect: work.aspect ?? v.aspect,
  };
}

export const resolvedWorks = (): Promise<ResolvedWork[]> => Promise.all(works.map(resolveWork));
