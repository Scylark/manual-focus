// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://manual-focus.co.uk',
  // GitHub Pages serves dir/index.html and 301-redirects /path to /path/.
  // Setting trailingSlash:'always' makes Astro emit hrefs with the trailing
  // slash so internal links hit the canonical URL directly, skipping the
  // 301 redirect hop that some users perceive as "the link doesn't work."
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
