// An episode's chapter plan, from the `chapters` list in the show notes'
// frontmatter. Each chapter is a title and `at`, a phrase quoted from the
// script where the chapter starts (usually the opening words of the turn, or
// the sentence that changes the subject). Shared by check-episode.mjs, which
// checks the plan before any audio is made, and chapters.mjs, which times it.

import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

// Words for matching: lower case, no audio tags, no punctuation, hyphens and
// dashes split, so the script and a speech-to-text transcript compare word
// for word.
export const words = (text) =>
  text
    .replace(/\[[^\]]*\]/g, ' ')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[-–—/]/g, ' ')
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/'/g, '')
    .split(/\s+/)
    .filter(Boolean);

// The script's spoken words, in order.
export const scriptWords = (scriptPath) =>
  words(readFileSync(scriptPath, 'utf8').replace(/^(JAMES|HANNAH):/gm, ' '));

export function readPlan(notesPath) {
  const front = readFileSync(notesPath, 'utf8').match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
  return yaml.load(front)?.chapters ?? [];
}

// Finds each chapter's starting word in the script. Returns
// { chapters: [{ title, index }], problems: [...] }. Chapters must appear in
// script order, and the first must start at the first word.
export function locate(plan, script) {
  const problems = [];
  const chapters = [];
  let from = 0;
  plan.forEach((c, n) => {
    if (!c?.title || !c?.at) {
      problems.push(`Chapter ${n + 1} needs a title and an "at" phrase`);
      return;
    }
    const phrase = words(String(c.at));
    let index = -1;
    for (let i = from; i <= script.length - phrase.length && index < 0; i++) {
      if (phrase.every((w, k) => script[i + k] === w)) index = i;
    }
    if (index < 0) {
      problems.push(`Chapter "${c.title}": "${c.at}" isn't in the script${n ? ' after the chapter before it' : ''}`);
      return;
    }
    if (n === 0 && index !== 0) problems.push(`The first chapter must start at the script's first words`);
    chapters.push({ title: String(c.title), index });
    from = index + 1;
  });
  return { chapters, problems };
}
