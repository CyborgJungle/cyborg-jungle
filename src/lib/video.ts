// Turns a pasted Vimeo/YouTube link into an embeddable player URL plus thumbnail and
// aspect ratio, using each site's public oEmbed endpoint. Runs at build time only.

export type VideoInfo = {
  embed: string;
  thumb?: string;
  /** CSS aspect-ratio value, e.g. "4 / 3". */
  aspect?: string;
};

type OEmbed = {
  html?: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
};

const cache = new Map<string, Promise<VideoInfo>>();

export function resolveVideo(url: string): Promise<VideoInfo> {
  let info = cache.get(url);
  if (!info) {
    info = load(url);
    cache.set(url, info);
  }
  return info;
}

function youTubeId(url: URL): string | undefined {
  if (url.hostname === 'youtu.be') return url.pathname.slice(1);
  if (url.searchParams.has('v')) return url.searchParams.get('v')!;
  return url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
}

async function oembed(endpoint: string): Promise<OEmbed> {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

function aspectOf(o: OEmbed): string | undefined {
  return o.width && o.height ? `${o.width} / ${o.height}` : undefined;
}

async function load(raw: string): Promise<VideoInfo> {
  const url = new URL(raw);

  if (url.hostname.endsWith('vimeo.com')) {
    const o = await oembed(
      `https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(raw)}`,
    ).catch((err) => {
      throw new Error(`Vimeo lookup failed for ${raw} (${err.message}). Is the video public or unlisted, with embedding allowed?`);
    });
    // The player src from oEmbed keeps the privacy hash that unlisted videos need.
    const src = o.html?.match(/src="([^"]+)"/)?.[1];
    if (!src) throw new Error(`Vimeo returned no player for ${raw}`);
    const embed = new URL(src);
    embed.searchParams.delete('app_id');
    for (const [k, v] of Object.entries({ dnt: '1', title: '0', byline: '0', portrait: '0' })) {
      embed.searchParams.set(k, v);
    }
    return { embed: embed.toString(), thumb: o.thumbnail_url, aspect: aspectOf(o) };
  }

  if (url.hostname.endsWith('youtube.com') || url.hostname === 'youtu.be') {
    const id = youTubeId(url);
    if (!id) throw new Error(`Could not find a YouTube video id in ${raw}`);
    // oEmbed is only used for the aspect ratio; the rest is derived from the id.
    const o = await oembed(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`,
    ).catch(() => ({}) as OEmbed);
    return {
      embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      aspect: aspectOf(o),
    };
  }

  throw new Error(`Unsupported video link: ${raw} (use a Vimeo or YouTube URL)`);
}
