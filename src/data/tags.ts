// The shared tag vocabulary. Keep in sync with the "tags" picker in .pages.yml.
export const TAGS = [
  'portrait',
  'figure',
  'dance',
  'eye band',
  'window',
  'diamond',
  'mosaic',
  'checkerboard',
  'colour key',
  'colour bleed',
  'tear',
  'melt',
  'interference',
  'noise',
  'monochrome',
  'silhouette',
  'op-art',
] as const;

/** Tags used by a set of works, in vocabulary order, with how many works carry each. */
export function tagCounts(works: { tags: string[] }[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const w of works) for (const t of w.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  const order = (t: string) => {
    const i = (TAGS as readonly string[]).indexOf(t);
    return i < 0 ? TAGS.length : i;
  };
  return [...counts].sort((a, b) => order(a[0]) - order(b[0]) || a[0].localeCompare(b[0]));
}
