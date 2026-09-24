// Mechanical quality gate for AI briefing posts.
//   node .claude/skills/ai-briefing/check.mjs src/content/blog/<slug>.md
// Run AFTER `npm run build` (internal links are checked against dist/).
// Exits 1 with a list of failures. It enforces what a script can check:
// lengths, structure, the no-slop absolute bans, banned words, invented
// experience and broken links. It does not replace the read-through.
import { readFileSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

const file = process.argv[2];
if (!file) { console.error('usage: node check.mjs <post.md>'); process.exit(2); }
const src = readFileSync(file, 'utf8');
const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!m) { console.error('FAIL no frontmatter'); process.exit(1); }
const fm = yaml.load(m[1]);
const body = m[2];
const fails = [];
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;

// Structure and lengths
if (!fm.title || fm.title.length > 65) fails.push(`title must be 1-65 chars (is ${fm.title?.length})`);
if (!fm.description || fm.description.length > 160) fails.push(`description must be 1-160 chars (is ${fm.description?.length})`);
if (!fm.tags?.includes('ai-briefing')) fails.push('tags must include ai-briefing');
const faq = fm.faq ?? [];
if (faq.length < 3 || faq.length > 5) fails.push(`faq needs 3-5 items (has ${faq.length})`);
faq.forEach((f, i) => {
  const n = words(f.answer ?? '');
  if (n < 40 || n > 80) fails.push(`faq[${i}] answer must be 40-80 words (is ${n})`);
});
const sources = fm.sources ?? [];
if (sources.length < 2) fails.push('sources needs the primary source plus at least one more');
const opening = body.trim().split(/\n\s*\n/)[0];
if (opening.startsWith('#')) fails.push('post must open with a paragraph, not a heading');
const openN = words(opening);
if (openN < 40 || openN > 60) fails.push(`opening paragraph must be 40-60 words (is ${openN})`);
const bodyN = words(body.replace(/\]\([^)]*\)/g, ']'));
if (bodyN < 600 || bodyN > 950) fails.push(`body should be 600-950 words (is ${bodyN})`);
if (!/Our view at Manual Focus/.test(body)) fails.push('body needs one "Our view at Manual Focus is ..." sentence');

// Text the reader sees, with link targets, URLs, emails and code stripped
const visible = [
  ['title', fm.title ?? ''],
  ['description', fm.description ?? ''],
  ...faq.flatMap((f, i) => [[`faq[${i}].question`, f.question ?? ''], [`faq[${i}].answer`, f.answer ?? '']]),
  ...sources.map((s, i) => [`sources[${i}].title`, s.title ?? '']),
  ['body', body],
].map(([k, t]) => [k, t
  .replace(/`[^`]*`/g, '')
  .replace(/\]\([^)]*\)/g, ']')
  .replace(/https?:\/\/\S+/g, '')
  .replace(/\S+@\S+\.\S+/g, '')]);

// no-slop absolute bans. Colons between digits (times) are allowed.
for (const [k, t] of visible) {
  if (t.includes('—')) fails.push(`${k}: em dash`);
  if (/;/.test(t)) fails.push(`${k}: semicolon`);
  if (/(?<!\d):(?!\d)/.test(t)) fails.push(`${k}: colon "${t.match(/.{0,30}(?<!\d):(?!\d).{0,20}/)?.[0]}"`);
}

const BANNED = [
  'delve', 'foster', 'leverage', 'utilize', 'utilise', 'facilitate', 'empower', 'streamline', 'robust',
  'cutting-edge', 'paradigm shift', 'game changer', 'game-changer', 'this is huge', 'this changes everything',
  'tapestry', 'realm', 'beacon', 'multifaceted', 'meticulous', 'intricate', 'paramount', 'transformative',
  'elevate', 'embark', 'supercharge', 'harness', 'ever-evolving', 'unlock', 'unleash', 'revolutionary',
  'landscape', "it's worth noting", "it's important to note", 'at the end of the day', 'when it comes to',
  'at its core', "in today's", 'in the age of', 'the reality is', 'the truth is', 'going forward',
  'in this article', "let's dive in", 'in conclusion', 'ultimately', 'stands as a testament', 'pivotal',
  'plays a vital role', 'underscores', 'highlighting', 'showcasing', 'experts agree', 'studies show',
  "here's what", 'what nobody tells you', 'the key point is', 'as you can see',
];
const EXPERIENCE = [
  'we tested', "we've tested", 'we have tested', 'our clients', 'our client', 'in our client work',
  "we've seen", 'we have seen', 'our testing', 'we ran a test',
];
const all = visible.map(([, t]) => t).join('\n').toLowerCase();
for (const w of BANNED) if (new RegExp(`\\b${w.replace(/[-']/g, (c) => `\\${c}`)}\\b`).test(all)) fails.push(`banned word/phrase "${w}"`);
for (const w of EXPERIENCE) if (all.includes(w)) fails.push(`claims first-hand experience "${w}"`);
if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all)) fails.push('emoji');

// Internal links resolve in the built site and use trailing slashes
for (const [, href] of body.matchAll(/\]\((\/[^)#\s]*)/g)) {
  if (!href.endsWith('/')) fails.push(`internal link needs trailing slash: ${href}`);
  if (!existsSync(`dist${href.replace(/\/?$/, '/')}index.html`)) fails.push(`broken internal link: ${href} (run npm run build first)`);
}

if (fails.length) { console.log(`FAIL ${file}\n- ${fails.join('\n- ')}`); process.exit(1); }
console.log(`PASS ${file} (opening ${openN} words, body ${bodyN} words, ${faq.length} FAQs, ${sources.length} sources)`);
