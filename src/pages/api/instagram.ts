// /api/instagram?p=<post code>&f=video|poster[&i=<carousel slide, from 0>]
// Sends the browser to the current file of one of the artist's Instagram posts. Instagram's
// file links expire, so the site links here instead and this looks up a fresh one.
import type { APIRoute } from 'astro';
import { listMedia, mediaFor } from '../../lib/instagram';

export const prerender = false;

const CODE = /^[\w-]{5,40}$/;

export const GET: APIRoute = async ({ url }) => {
  // /api/instagram?list: the post codes the site can see (public information only).
  if (url.searchParams.has('list')) {
    try {
      return Response.json(await listMedia(), { headers: { 'Cache-Control': 'public, s-maxage=300' } });
    } catch (err) {
      console.error(err);
      return Response.json({ error: (err as Error).message }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  }
  const code = url.searchParams.get('p') ?? '';
  const want = url.searchParams.get('f') === 'poster' ? 'poster' : 'video';
  if (!CODE.test(code)) return new Response('Bad post code', { status: 400 });
  try {
    const media = await mediaFor(code);
    const i = url.searchParams.get('i');
    const item = i === null ? media : /^\d{1,2}$/.test(i) ? media?.slides?.[Number(i)] : undefined;
    const target = item?.[want] ?? (want === 'video' ? undefined : item?.video);
    if (!target) {
      return new Response('Not found on the Instagram account', { status: 404, headers: { 'Cache-Control': 'public, s-maxage=300' } });
    }
    // The CDN keeps this answer for an hour; Instagram's links last well beyond that.
    return new Response(null, {
      status: 302,
      headers: { Location: target, 'Cache-Control': 'public, max-age=600, s-maxage=3600, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Instagram is not reachable right now', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
