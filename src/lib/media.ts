import type { ImageMetadata } from 'astro';

// Pages CMS stores uploads in src/assets/media and writes paths like "/media/photo.jpg"
// into content. Map those to the imported files so Astro can resize them at build time.
const files = import.meta.glob<ImageMetadata>('/src/assets/media/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
});

export type Img = ImageMetadata | string;

/** Resolve a CMS media path to an optimisable image; other URLs pass through unchanged. */
export function resolveImage(path: string | undefined): Img | undefined {
  if (!path) return undefined;
  if (path.startsWith('/media/')) {
    const found = files[`/src/assets${path}`];
    if (!found) throw new Error(`Image not found: ${path} (expected at src/assets${path})`);
    return found;
  }
  return path;
}
