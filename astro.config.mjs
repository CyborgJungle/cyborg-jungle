import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Pages stay static; only the Instagram routes in src/pages/api run on Vercel Functions.
export default defineConfig({
  site: 'https://cyborg-jungle.vercel.app',
  adapter: vercel(),
});
