#!/usr/bin/env node
// Builds a minibook: writes its diagrams as SVGs for the web article and
// renders the book to a PDF with them inlined, so the two always match.
//
// Usage: node minibooks/build.mjs <name>
//   reads   minibooks/<name>/diagrams.mjs and minibooks/<name>/book.html
//   writes  public/images/<name>/<diagram>.svg
//           public/downloads/<name>-minibook.pdf
//
// Needs Playwright with Chromium (pre-installed in cloud sessions; locally,
// `npx playwright install chromium`) and network access for the book's
// Google Fonts.

import { mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) throw new Error('Usage: node minibooks/build.mjs <name>');

const dir = join(ROOT, 'minibooks', name);
const { all } = await import(pathToFileURL(join(dir, 'diagrams.mjs')).href);

const imgDir = join(ROOT, 'public', 'images', name);
mkdirSync(imgDir, { recursive: true });
const svgs = {};
for (const [key, draw] of Object.entries(all)) {
  svgs[key] = draw();
  writeFileSync(join(imgDir, `${key}.svg`), svgs[key] + '\n');
  console.log(`Wrote public/images/${name}/${key}.svg`);
}

let html = readFileSync(join(dir, 'book.html'), 'utf8');
html = html.replace(/\{\{(\w+)\}\}/g, (m, key) => {
  if (!svgs[key]) throw new Error(`book.html uses {{${key}}} but diagrams.mjs has no ${key}()`);
  return svgs[key];
});

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const out = join(ROOT, 'public', 'downloads', `${name}-minibook.pdf`);
await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
await browser.close();
console.log(`Wrote public/downloads/${name}-minibook.pdf (${(statSync(out).size / 1024).toFixed(0)} KB)`);
