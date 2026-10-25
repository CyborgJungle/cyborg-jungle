import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Edited through Pages CMS (.pages.yml). The CMS may write empty strings or null for
// blank fields, so optional text fields treat those as missing.
const text = z
  .string()
  .nullish()
  .transform((v) => v?.trim() || undefined);

const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['image', 'video', 'installation']),
    year: z.coerce.number().int(),
    /** Optional exact date (YYYY-MM-DD), used to order works within a year. */
    // YAML turns 2022-11-06 into a Date; Pages CMS may also write a string.
    date: z
      .union([z.date(), z.string()])
      .nullish()
      .transform((v) => (v instanceof Date ? v.toISOString() : v)?.slice(0, 10) || undefined),
    video: text,
    image: text,
    gallery: z
      .array(z.string())
      .nullish()
      .transform((v) => v?.filter(Boolean) ?? []),
    /** Cycle the main image and extra images on a timer. */
    slideshow: z
      .boolean()
      .nullish()
      .transform((v) => v ?? false),
    /** Seconds per image in a slideshow. */
    interval: z
      .union([z.number(), z.string()])
      .nullish()
      .transform((v) => (Number(v) > 0 ? Number(v) : 1.5)),
    medium: text,
    format: text,
    duration: text,
    location: text,
    description: text,
    aspect: text,
    pattern: z.enum(['stripes', 'rings', 'grid', 'tunnel', 'scan', 'bars']).nullish().transform((v) => v ?? undefined),
  }),
});

export const collections = { works };
