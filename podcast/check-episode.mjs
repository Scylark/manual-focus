#!/usr/bin/env node
// Checks an episode's script and show notes against podcast/SHOW-RULES.md
// before any audio is made. It catches the mechanical rules (format, hosts,
// digits, James's tags, the "Get AI on this" segment, the notes' shape). It
// can't check that every claim comes from the post; that stays a read-through.
//
// Usage: node podcast/check-episode.mjs <slug>
// Prints PASS or FAIL with the problems, plus warnings. Exits 1 on FAIL.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2];
if (!slug) throw new Error('Usage: node podcast/check-episode.mjs <slug>');

const fails = [];
const warns = [];
const paths = {
  script: join(ROOT, 'scripts', `${slug}.txt`),
  notes: join(ROOT, 'notes', `${slug}.md`),
  post: join(ROOT, '..', 'src', 'content', 'blog', `${slug}.md`),
};
for (const [what, file] of Object.entries(paths)) {
  if (!existsSync(file)) fails.push(`No ${what} at ${file}`);
}
if (fails.length) report();

// The script.
const JAMES_TAGS = new Set(['thoughtfully', 'dryly', 'calmly', 'pause', 'chuckles']);
const ASSISTANTS = /\b(ChatGPT|Claude|Gemini|Copilot|Perplexity|Grok)\b/;
const BANNED = /great question|absolutely|game[- ]changer|let's dive in|fast-paced|in today's/i;

const turns = readFileSync(paths.script, 'utf8')
  .split(/\n\s*\n/)
  .map((b) => b.trim())
  .filter(Boolean)
  .map((block, i) => {
    const m = block.match(/^(JAMES|HANNAH):\s*([\s\S]+)$/);
    if (!m) fails.push(`Turn ${i + 1} doesn't start with JAMES: or HANNAH:`);
    return { n: i + 1, speaker: m?.[1], text: (m?.[2] ?? block).replace(/\s+/g, ' ') };
  });

const words = turns.reduce((n, t) => n + t.text.replace(/\[[^\]]*\]/g, '').split(/\s+/).filter(Boolean).length, 0);
if (words < 800 || words > 1300) fails.push(`Script is ${words} words; aim for 900 to 1,100`);
else if (words < 900 || words > 1100) warns.push(`Script is ${words} words; aim for 900 to 1,100`);

if (turns[0]?.speaker !== 'JAMES') fails.push('James must open the episode');
// James closes; a one-line "Thanks, James" from Hannah after him is fine.
if (!turns.slice(-2).some((t) => t.speaker === 'JAMES')) fails.push('James must close the episode');
if (!/manual[- ]focus(\.| dot )co(\.| dot )uk/i.test(turns.slice(-3).map((t) => t.text).join(' '))) {
  warns.push('The close should point to the full article on manual-focus.co.uk');
}

// The close's call to action, in James's closing turns: follow the show
// somewhere specific, and book a free working session with Manual Focus.
const jamesClose = turns.slice(-3).filter((t) => t.speaker === 'JAMES').map((t) => t.text).join(' ');
const subscribe = /\b(subscribe|follow)\b/i.test(jamesClose)
  && /apple podcasts|spotify|wherever you (listen|get)/i.test(jamesClose);
if (!subscribe) fails.push("James's close needs the subscribe call to action: follow the show in Apple Podcasts, Spotify or wherever they listen");
const contact = /free working session/i.test(jamesClose)
  && /manual[- ]focus(\.| dot )co(\.| dot )uk/i.test(jamesClose);
if (!contact) fails.push("James's close needs the Manual Focus call to action: book a free working session at manual-focus dot co dot uk");

let tagged = 0;
for (const t of turns) {
  const tags = [...t.text.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1].trim().toLowerCase());
  if (tags.length) tagged++;
  const spoken = t.text.replace(/\[[^\]]*\]/g, '');
  if (/\d/.test(spoken)) fails.push(`Turn ${t.n} has digits; write numbers as they're said`);
  if (/https?:\/\/|www\./i.test(spoken)) fails.push(`Turn ${t.n} reads out a URL`);
  if (BANNED.test(spoken)) fails.push(`Turn ${t.n} uses a banned phrase ("${spoken.match(BANNED)[0]}")`);
  const n = spoken.split(/\s+/).filter(Boolean).length;
  if (n > 90) warns.push(`Turn ${t.n} (${t.speaker}) is ${n} words; keep turns under about 30 seconds`);
  if (t.speaker === 'JAMES') {
    if (spoken.includes('!')) fails.push(`Turn ${t.n}: no exclamation marks for James`);
    for (const tag of tags) {
      if (!JAMES_TAGS.has(tag)) fails.push(`Turn ${t.n}: [${tag}] isn't one of James's tags (${[...JAMES_TAGS].join(', ')})`);
    }
  }
}
if (tagged > turns.length / 3) warns.push(`${tagged} of ${turns.length} turns have audio tags; use them sparingly`);

// The "Get AI on this" segment: James opens it, it ends on the show-notes line,
// and it names no assistant brand.
const start = turns.findIndex((t) => t.speaker === 'JAMES' && /get AI on this/i.test(t.text));
const end = turns.findIndex((t) => /prompts\b.*\bin the show notes/i.test(t.text));
if (start < 0) fails.push('No James turn with "Get AI on this"');
if (end < 0) fails.push('Missing the "The prompts are in the show notes" line');
if (start >= 0 && end >= start) {
  for (const t of turns.slice(start, end + 1)) {
    const brand = t.text.match(ASSISTANTS);
    if (brand) warns.push(`Turn ${t.n} names ${brand[0]} inside "Get AI on this"; on air it's "AI" or "your AI"`);
  }
} else if (start >= 0 && end >= 0) {
  fails.push('"The prompts are in the show notes" comes before "Get AI on this"');
}

// The show notes.
const notes = readFileSync(paths.notes, 'utf8');
const post = readFileSync(paths.post, 'utf8');
const front = notes.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
if (!new RegExp(`^post: ${slug}$`, 'm').test(front)) fails.push(`Notes frontmatter needs "post: ${slug}"`);
const title = front.match(/^title: "(.*)"$/m)?.[1];
const postTitle = post.match(/^title: "(.*)"$/m)?.[1];
if (!title) fails.push('Notes frontmatter needs a quoted title');
else if (postTitle && title !== postTitle) warns.push(`Notes title differs from the post's ("${postTitle}")`);
if (!/^## Get AI on this$/m.test(notes)) fails.push('Notes need a "## Get AI on this" section');
const prompts = (notes.match(/^```text$/gm) ?? []).length;
if (prompts < 2 || prompts > 3) fails.push(`Notes have ${prompts} \`\`\`text prompt block(s); one per job, two or three in all`);
const promptText = [...notes.matchAll(/^```text\n([\s\S]*?)^```$/gm)].map((m) => m[1]).join('\n');
if (/\b(Custom GPTs?|Gems?|Projects? feature|Copilot Studio|Artifacts?)\b/.test(promptText)) {
  warns.push('A prompt names a product feature; prompts must work in any assistant');
}
if (!/couldn't|could not|can't see|cannot|not in data|say so/i.test(promptText)) {
  warns.push('No prompt tells the model to say what it couldn\'t check');
}
if (/https?:\/\//.test(notes.replace(/```[\s\S]*?```/g, ''))) {
  warns.push('Notes link out; the post already lists the sources, so don\'t repeat them');
}

report();

function report() {
  console.log(fails.length ? 'FAIL' : 'PASS');
  for (const f of fails) console.log(`  x ${f}`);
  for (const w of warns) console.log(`  ! ${w}`);
  process.exit(fails.length ? 1 : 0);
}
