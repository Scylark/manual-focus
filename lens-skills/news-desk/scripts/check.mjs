// News desk quality gate. Every limit and banned word comes from the brand's
// config, so the same script works for any site.
//
//   node check.mjs [--article] [--config .lens/news-desk.json] <post.md> [<translation.md> ...]
//
// Run AFTER the site build (internal links are checked against the build
// output). Exits 1 with a list of failures. It checks what a script can check:
// lengths, structure, the voice's absolute bans, banned words, claimed
// experience and broken internal links. It doesn't replace the read-through.
//
// Needs a YAML parser for frontmatter: js-yaml or yaml, whichever the repo
// has. If neither is installed: npm i -D js-yaml
import { readFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const article = args.includes('--article');
const cfgIdx = args.indexOf('--config');
const cfgPath = cfgIdx >= 0 ? args[cfgIdx + 1] : '.lens/news-desk.json';
const files = args.filter((a, i) => !a.startsWith('--') && !(cfgIdx >= 0 && i === cfgIdx + 1));
if (!files.length) { console.error('usage: node check.mjs [--article] [--config path] <post.md> [...]'); process.exit(2); }
if (!existsSync(cfgPath)) { console.error(`FAIL no config at ${cfgPath} (run the news-desk set-up first)`); process.exit(1); }
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const post = cfg.post ?? {};
const voice = cfg.voice ?? {};

let parseYaml;
try { parseYaml = (await import('js-yaml')).load; } catch {
  try { parseYaml = (await import('yaml')).parse; } catch {
    console.error('FAIL no YAML parser found. Install one: npm i -D js-yaml'); process.exit(1);
  }
}

const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const within = (n, [lo, hi]) => n >= lo && n <= hi;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let failed = false;

for (const file of files) {
  const fails = [];
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) { console.log(`FAIL ${file}\n- no frontmatter`); failed = true; continue; }
  const fm = parseYaml(m[1]) ?? {};
  const body = m[2];

  // Structure and lengths
  if (!fm.title || fm.title.length > (post.title_max ?? 65)) fails.push(`title must be 1-${post.title_max ?? 65} chars (is ${fm.title?.length})`);
  if (!fm.description || fm.description.length > (post.description_max ?? 160)) fails.push(`description must be 1-${post.description_max ?? 160} chars (is ${fm.description?.length})`);
  const tags = fm.tags ?? [];
  if (post.news_tag) {
    if (!article && !tags.includes(post.news_tag)) fails.push(`tags must include "${post.news_tag}" (use --article for an on-demand article)`);
    if (article && post.article_tags_exclude_news_tag && tags.includes(post.news_tag)) fails.push(`on-demand articles must not carry the "${post.news_tag}" tag`);
  }
  if (post.layout_renders_faq_and_sources !== false) {
    const faq = fm.faq ?? [];
    const [fLo, fHi] = article ? [4, 5] : (post.faq_items ?? [3, 5]);
    if (!within(faq.length, [fLo, fHi])) fails.push(`faq needs ${fLo}-${fHi} items (has ${faq.length})`);
    faq.forEach((f, i) => {
      const n = words(f.answer ?? '');
      if (!within(n, post.faq_answer_words ?? [40, 80])) fails.push(`faq[${i}] answer must be ${(post.faq_answer_words ?? [40, 80]).join('-')} words (is ${n})`);
    });
    if ((fm.sources ?? []).length < (post.min_sources ?? 2)) fails.push(`sources needs the primary source plus at least one more (min ${post.min_sources ?? 2})`);
  }
  const opening = body.trim().split(/\n\s*\n/)[0];
  if (opening.startsWith('#')) fails.push('post must open with a paragraph, not a heading');
  const openN = words(opening);
  if (!within(openN, post.opening_words ?? [40, 60])) fails.push(`opening paragraph must be ${(post.opening_words ?? [40, 60]).join('-')} words (is ${openN})`);
  const bodyN = words(body.replace(/\]\([^)]*\)/g, ']'));
  const range = (post.body_words ?? {})[article ? 'article' : 'news'] ?? (article ? [800, 1600] : [600, 950]);
  if (!within(bodyN, range)) fails.push(`body should be ${range.join('-')} words (is ${bodyN})`);
  if (voice.opinion_opener && !body.includes(voice.opinion_opener)) fails.push(`body needs one "${voice.opinion_opener} ..." sentence`);

  // Visible text, with link targets, URLs, emails and code stripped
  const visible = [
    ['title', fm.title ?? ''], ['description', fm.description ?? ''],
    ...(fm.faq ?? []).flatMap((f, i) => [[`faq[${i}].question`, f.question ?? ''], [`faq[${i}].answer`, f.answer ?? '']]),
    ...(fm.sources ?? []).map((s, i) => [`sources[${i}].title`, s.title ?? '']),
    ['body', body],
  ].map(([k, t]) => [k, t.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']').replace(/https?:\/\/\S+/g, '').replace(/\S+@\S+\.\S+/g, '')]);

  const bans = new Set(voice.absolute_bans ?? ['em-dash']);
  for (const [k, t] of visible) {
    if (bans.has('em-dash') && t.includes('—')) fails.push(`${k}: em dash`);
    if (bans.has('semicolon') && /;/.test(t)) fails.push(`${k}: semicolon`);
    if (bans.has('colon') && /(?<!\d):(?!\d)/.test(t.replace(/^#+ .*$/gm, ''))) fails.push(`${k}: colon "${t.match(/.{0,30}(?<!\d):(?!\d).{0,20}/)?.[0]}"`);
    if (bans.has('exclamation') && /!(?!\[)/.test(t)) fails.push(`${k}: exclamation mark`);
  }
  const all = visible.map(([, t]) => t).join('\n').toLowerCase();
  if (bans.has('emoji') && /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all)) fails.push('emoji');
  for (const w of voice.banned_words ?? []) if (new RegExp(`\\b${escape(w.toLowerCase())}\\b`).test(all)) fails.push(`banned word/phrase "${w}"`);
  for (const w of voice.claimed_experience ?? []) if (all.includes(w.toLowerCase())) fails.push(`claims first-hand experience "${w}"`);

  // Internal links resolve in the build output
  const out = cfg.build?.output_dir;
  for (const [, href] of body.matchAll(/\]\((\/[^)#\s]*)/g)) {
    if (post.internal_link_trailing_slash && !href.endsWith('/') && !/\.\w+$/.test(href)) fails.push(`internal link needs trailing slash: ${href}`);
    if (out) {
      const clean = href.replace(/\/?$/, '/');
      if (!existsSync(`${out}${clean}index.html`) && !existsSync(`${out}${href}`) && !existsSync(`${out}${href.replace(/\/$/, '')}.html`)) {
        fails.push(`broken internal link: ${href} (build first)`);
      }
    }
  }

  if (fails.length) { failed = true; console.log(`FAIL ${file}\n- ${fails.join('\n- ')}`); }
  else console.log(`PASS ${file} (opening ${openN} words, body ${bodyN} words, ${(fm.faq ?? []).length} FAQs, ${(fm.sources ?? []).length} sources)`);
}
process.exit(failed ? 1 : 0);
