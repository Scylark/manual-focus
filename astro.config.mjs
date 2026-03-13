// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://scylark.github.io',
  base: '/manual-focus',
  integrations: [sitemap()],
});
