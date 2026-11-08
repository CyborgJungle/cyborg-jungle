// Renews the Instagram access token (valid 60 days) so it never runs out.
// Called weekly by the Vercel cron in vercel.json. Calling it by hand is harmless: it only
// extends the token, and never shows it.
import type { APIRoute } from 'astro';
import { refreshToken } from '../../lib/instagram';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const { expiresAt } = await refreshToken();
    return Response.json({ ok: true, expiresAt }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: (err as Error).message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
};
