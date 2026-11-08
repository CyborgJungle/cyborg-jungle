// Plays the artist's own Instagram videos on the site without Instagram's embed frame.
// Runs on the server (src/pages/api/instagram*.ts), never in the browser, so the access
// token stays private. See README "Instagram videos" for the one-time Meta setup.
//
// The token lives in the INSTAGRAM_TOKEN environment variable (Vercel → Settings →
// Environment Variables). Two kinds work:
// - Instagram User token ("IG…", 60 days, from Instagram login): read via graph.instagram.com.
//   A weekly cron renews it and keeps the renewed copy in a private Vercel Blob store.
// - System-user token ("EAA…", never expires, from Meta's Unified login setup): read via
//   graph.facebook.com for the account in INSTAGRAM_USER_ID. Nothing to renew.
import { createHash } from 'node:crypto';
import { get, put } from '@vercel/blob';

const GRAPH = 'https://graph.instagram.com';
const FB_GRAPH = 'https://graph.facebook.com';
const TOKEN_BLOB = 'instagram/token.json';

/** Instagram-login tokens start with "IG"; Facebook-issued ones (system user) with "EAA". */
const isInstagramToken = (token: string) => token.startsWith('IG');
const fingerprint = (token: string) => createHash('sha256').update(token).digest('hex').slice(0, 16);

/** The post code in an Instagram link: instagram.com/reel/<code>/ or /p/<code>/. */
export function shortcodeOf(raw: string): string | undefined {
  try {
    const url = new URL(raw);
    if (!/(^|\.)instagram\.com$/.test(url.hostname)) return undefined;
    return url.pathname.match(/^\/(?:[\w.]+\/)?(?:p|reels?|tv)\/([\w-]+)/)?.[1];
  } catch {
    return undefined;
  }
}

export const isInstagram = (raw: string) => shortcodeOf(raw) !== undefined;

/** `from` is the fingerprint of the INSTAGRAM_TOKEN it was renewed from. */
type StoredToken = { token: string; from: string; refreshedAt: string; expiresAt?: string };

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

async function storedToken(): Promise<StoredToken | undefined> {
  if (!hasBlob()) return undefined;
  try {
    const res = await get(TOKEN_BLOB, { access: 'private', useCache: false });
    if (res?.statusCode !== 200 || !res.stream) return undefined;
    return JSON.parse(await new Response(res.stream).text());
  } catch {
    return undefined;
  }
}

const envToken = () => process.env.INSTAGRAM_TOKEN?.trim() || undefined;

export async function accessToken(): Promise<string | undefined> {
  const env = envToken();
  if (!env || !isInstagramToken(env)) return env;
  // A renewed copy only counts while INSTAGRAM_TOKEN is still the token it was renewed from,
  // so pasting a new token in Vercel always takes effect.
  const stored = await storedToken();
  return stored?.from === fingerprint(env) ? stored.token : env;
}

/** Renews an Instagram User token for another 60 days and stores the renewed copy. */
export async function refreshToken(): Promise<{ expiresAt: string }> {
  const env = envToken();
  const current = await accessToken();
  if (!env || !current) throw new Error('No Instagram token configured (INSTAGRAM_TOKEN)');
  if (!isInstagramToken(env)) return { expiresAt: 'never (system-user token)' };
  if (!hasBlob()) throw new Error('No Blob store connected: the renewed token cannot be saved');
  const res = await fetch(`${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(current)}`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: { message?: string } };
  if (!res.ok || !data.access_token) throw new Error(`Instagram refresh failed: ${data.error?.message ?? res.status}`);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (data.expires_in ?? 60 * 86400) * 1000).toISOString();
  const record: StoredToken = { token: data.access_token, from: fingerprint(env), refreshedAt: now.toISOString(), expiresAt };
  await put(TOKEN_BLOB, JSON.stringify(record), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
  return { expiresAt };
}

export type Media = { video?: string; poster?: string; type?: string; product?: string };

type GraphMedia = {
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  children?: { data: GraphMedia[] };
};

// Instagram's file links expire after a while, so the list is fetched fresh, then kept for
// a few minutes per server instance (the CDN in front keeps each answer for an hour).
let index: { at: number; byCode: Map<string, Media> } | undefined;
const INDEX_TTL = 10 * 60 * 1000;

function mediaOf(m: GraphMedia): Media {
  if (m.media_type === 'CAROUSEL_ALBUM') {
    const kids = m.children?.data ?? [];
    const pick = kids.find((k) => k.media_type === 'VIDEO') ?? kids[0];
    return pick ? mediaOf(pick) : {};
  }
  if (m.media_type === 'VIDEO') return { video: m.media_url, poster: m.thumbnail_url };
  return { poster: m.media_url };
}

async function loadIndex(token: string): Promise<Map<string, Media>> {
  const byCode = new Map<string, Media>();
  const fields = 'media_type,media_product_type,media_url,thumbnail_url,permalink,children{media_type,media_url,thumbnail_url}';
  let base = `${GRAPH}/me/media`;
  if (!isInstagramToken(token)) {
    const user = process.env.INSTAGRAM_USER_ID?.trim();
    if (!user) throw new Error('INSTAGRAM_USER_ID is needed with a system-user token');
    base = `${FB_GRAPH}/${encodeURIComponent(user)}/media`;
  }
  let next: string | undefined = `${base}?fields=${encodeURIComponent(fields)}&limit=100&access_token=${encodeURIComponent(token)}`;
  // Up to 1000 posts: plenty for a portfolio, and bounded so a bad answer cannot loop forever.
  for (let page = 0; next && page < 10; page++) {
    const res = await fetch(next);
    const data = (await res.json()) as { data?: GraphMedia[]; paging?: { next?: string }; error?: { message?: string } };
    if (!res.ok) throw new Error(`Instagram media list failed: ${data.error?.message ?? res.status}`);
    for (const m of data.data ?? []) {
      const code = m.permalink && shortcodeOf(m.permalink);
      if (code) byCode.set(code, { ...mediaOf(m), type: m.media_type, product: m.media_product_type });
    }
    next = data.paging?.next;
  }
  return byCode;
}

/** The current file links for one of the account's posts, or undefined if it is not found. */
export async function mediaFor(code: string): Promise<Media | undefined> {
  const token = await accessToken();
  if (!token) throw new Error('No Instagram token configured (INSTAGRAM_TOKEN)');
  const age = index ? Date.now() - index.at : Infinity;
  // A post the list does not know yet (just published) triggers a reload, at most once a minute.
  if (age > INDEX_TTL || (!index!.byCode.has(code) && age > 60_000)) {
    index = { at: Date.now(), byCode: await loadIndex(token) };
  }
  return index.byCode.get(code);
}

/** Every post the API returns, as code + type: lets the artist (and debugging) see what is playable. */
export async function listMedia(): Promise<{ code: string; type?: string; product?: string; video: boolean }[]> {
  const token = await accessToken();
  if (!token) throw new Error('No Instagram token configured (INSTAGRAM_TOKEN)');
  index = { at: Date.now(), byCode: await loadIndex(token) };
  return [...index.byCode].map(([code, m]) => ({ code, type: m.type, product: m.product, video: Boolean(m.video) }));
}
