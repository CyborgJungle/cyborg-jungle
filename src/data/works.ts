import { getCollection, type CollectionEntry } from 'astro:content';
import { resolveVideo } from '../lib/video';
import { resolveImage, type Img } from '../lib/media';
import type { ChannelId } from './channels';

export type Pattern = 'stripes' | 'rings' | 'grid' | 'tunnel' | 'scan' | 'bars';

/** A work ready to render: media resolved, video link turned into an embeddable player. */
export type ResolvedWork = Omit<CollectionEntry<'works'>['data'], 'image' | 'gallery'> & {
  slug: string;
  kind: ChannelId;
  image?: Img;
  gallery: Img[];
  /** Main image followed by the extra images: the frames of a slideshow. */
  frames: Img[];
  /** Grid thumbnail: the image, else the video's thumbnail. */
  thumb?: Img;
  embed?: string;
};

// Works live in src/content/works/*.md and are edited through Pages CMS.
async function resolveWork(entry: CollectionEntry<'works'>): Promise<ResolvedWork> {
  const d = entry.data;
  const image = resolveImage(d.image);
  const gallery = d.gallery.map((g) => resolveImage(g)!);
  const frames = image ? [image, ...gallery] : gallery;
  const work: ResolvedWork = { ...d, slug: entry.id, image, gallery, frames, thumb: image };
  if (!d.video) return work;
  const v = await resolveVideo(d.video);
  return { ...work, embed: v.embed, thumb: image ?? v.thumb, aspect: d.aspect ?? v.aspect };
}

let cache: Promise<ResolvedWork[]> | undefined;

const hasMedia = (w: ResolvedWork) => (w.frames.length > 0 || w.embed ? 1 : 0);
const sortKey = (w: ResolvedWork) => w.date ?? `${w.year}-12-31`;

/** All works: real media before placeholders, then newest first. */
export function resolvedWorks(): Promise<ResolvedWork[]> {
  cache ??= getCollection('works').then(async (entries) =>
    (await Promise.all(entries.map(resolveWork))).sort(
      (a, b) => hasMedia(b) - hasMedia(a) || sortKey(b).localeCompare(sortKey(a)) || a.title.localeCompare(b.title),
    ),
  );
  return cache;
}

export const worksIn = async (kind: ChannelId) => (await resolvedWorks()).filter((w) => w.kind === kind);
