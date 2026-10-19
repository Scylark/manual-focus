// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://manual-focus.co.uk';

// lastmod for blog posts, read straight from frontmatter (updated ?? date).
// Answer engines and crawlers use it as a freshness signal, which matters
// for the daily AI briefing posts. Pages without a known date get no
// lastmod rather than a misleading build timestamp.
const blogLastmod = new Map(
  readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const src = readFileSync(`./src/content/blog/${f}`, 'utf8');
      const pick = (key) => src.match(new RegExp(`^${key}:\\s*["']?([0-9-]+)`, 'm'))?.[1];
      const date = pick('updated') ?? pick('date');
      return [`${SITE}/blog/${f.replace(/\.md$/, '')}/`, date];
    })
    .filter(([, date]) => date),
);

// Unlisted posts are live but kept out of the sitemap until launch.
const unlistedUrls = new Set(
  readdirSync('./src/content/blog')
    .filter((f) => f.endsWith('.md') && /^unlisted:\s*true\s*$/m.test(readFileSync(`./src/content/blog/${f}`, 'utf8')))
    .map((f) => `${SITE}/blog/${f.replace(/\.md$/, '')}/`),
);
// Pages that are live but not launched yet (they also set noindex).
for (const path of ['/light-meter/']) unlistedUrls.add(`${SITE}${path}`);

// lastmod for Lens playbooks (updatedAt ?? publishedAt), keyed by URL.
const lensLastmod = new Map(
  readdirSync('./src/content/lens')
    .flatMap((stack) =>
      readdirSync(`./src/content/lens/${stack}`)
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          const src = readFileSync(`./src/content/lens/${stack}/${f}`, 'utf8');
          const pick = (key) => src.match(new RegExp(`^${key}:\\s*["']?([0-9-]+)`, 'm'))?.[1];
          return [`${SITE}/lens/${stack}/${f.replace(/\.md$/, '')}/`, pick('updatedAt') ?? pick('publishedAt')];
        }),
    )
    .filter(([, date]) => date),
);

export default defineConfig({
  site: SITE,
  // GitHub Pages serves dir/index.html and 301-redirects /path to /path/.
  // Setting trailingSlash:'always' makes Astro emit hrefs with the trailing
  // slash so internal links hit the canonical URL directly, skipping the
  // 301 redirect hop that some users perceive as "the link doesn't work."
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !unlistedUrls.has(page),
      serialize(item) {
        const date = blogLastmod.get(item.url) ?? lensLastmod.get(item.url);
        if (date) item.lastmod = new Date(date).toISOString();
        return item;
      },
    }),
  ],
});
