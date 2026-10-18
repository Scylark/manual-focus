#!/usr/bin/env node
// Times an episode's chapters and writes podcast/chapters/<slug>.json, the
// Podcasting 2.0 chapters file the feed links with <podcast:chapters>.
//
// The chapter titles and where each starts come from the `chapters` list in
// podcast/notes/<slug>.md (see "Chapters" in SHOW-RULES.md). The times come
// from the published audio: ElevenLabs Speech to Text transcribes the MP3 with
// a timestamp per word, the transcript is aligned with the script word by
// word, and each chapter starts at the time of its first word.
//
// Usage: node podcast/chapters.mjs <slug> [--retranscribe]
// Run it after publish-episode.mjs, so the post's frontmatter has the audio
// URL. The transcript is cached in podcast/out/chapters/ (git ignores it), so
// a re-run after changing titles costs nothing; --retranscribe ignores the
// cache. Needs ELEVENLABS_API_KEY locally, or the network secret in a cloud
// session.

import { readFileSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { words, scriptWords, readPlan, locate } from './chapter-plan.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const slug = process.argv.slice(2).find((a) => !a.startsWith('--'));
const retranscribe = process.argv.includes('--retranscribe');
if (!slug) throw new Error('Usage: node podcast/chapters.mjs <slug> [--retranscribe]');

const paths = {
  script: join(ROOT, 'scripts', `${slug}.txt`),
  notes: join(ROOT, 'notes', `${slug}.md`),
  post: join(ROOT, '..', 'src', 'content', 'blog', `${slug}.md`),
};
for (const [what, file] of Object.entries(paths)) {
  if (!existsSync(file)) throw new Error(`No ${what} at ${file}`);
}

const script = scriptWords(paths.script);
const { chapters, problems } = locate(readPlan(paths.notes), script);
if (!chapters.length) problems.push(`No chapters in ${paths.notes}; add a "chapters" list to its frontmatter`);
if (problems.length) throw new Error(`Chapter plan:\n  ${problems.join('\n  ')}`);

const front = yaml.load(readFileSync(paths.post, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '');
const audio = front?.podcast?.audio;
if (!audio) throw new Error(`${slug} has no podcast block yet; run publish-episode.mjs first`);

// The transcript, cached per audio file so a re-voiced episode is transcribed
// afresh.
const cacheDir = join(ROOT, 'out', 'chapters');
mkdirSync(cacheDir, { recursive: true });
const cache = join(cacheDir, `${basename(new URL(audio).pathname, '.mp3')}.json`);
if (retranscribe || !existsSync(cache)) transcribe(audio, cache);
const stt = JSON.parse(readFileSync(cache, 'utf8'));

// Transcript tokens with their start times. One spoken word can normalise to
// several tokens ("e-commerce"), and each keeps the word's start.
const heard = [];
for (const w of stt.words ?? []) {
  if (w.type && w.type !== 'word') continue;
  for (const t of words(w.text)) heard.push({ t, start: w.start });
}
if (heard.length < script.length / 2) {
  throw new Error(`The transcript has ${heard.length} words against the script's ${script.length}; is ${audio} the right episode?`);
}

// Longest common subsequence of script and transcript tokens. The voices say
// the script verbatim, so nearly every word pairs up; numbers and names the
// transcriber writes differently ("82%" for "eighty-two per cent") are simply
// skipped.
const n = script.length;
const m = heard.length;
const dp = new Uint16Array((n + 1) * (m + 1));
const at = (i, j) => i * (m + 1) + j;
for (let i = n - 1; i >= 0; i--) {
  for (let j = m - 1; j >= 0; j--) {
    dp[at(i, j)] = script[i] === heard[j].t
      ? dp[at(i + 1, j + 1)] + 1
      : Math.max(dp[at(i + 1, j)], dp[at(i, j + 1)]);
  }
}
const pairOf = new Int32Array(n).fill(-1);
for (let i = 0, j = 0; i < n && j < m;) {
  if (script[i] === heard[j].t) pairOf[i++] = j++;
  else if (dp[at(i + 1, j)] >= dp[at(i, j + 1)]) i++;
  else j++;
}
const matched = pairOf.filter((j) => j >= 0).length;
if (matched < n * 0.8) {
  throw new Error(`Only ${matched} of ${n} script words matched the transcript; is ${audio} the right episode?`);
}

// Each chapter starts at its first word. When that word wasn't matched, step
// back from the next matched word by the number of words between them.
const warnings = [];
const timed = chapters.map(({ title, index }, c) => {
  if (c === 0) return { startTime: 0, title };
  let i = index;
  while (i < n && pairOf[i] < 0) i++;
  if (i >= n) throw new Error(`Couldn't place "${title}" in the audio`);
  if (i - index > 3) warnings.push(`"${title}" placed from a word ${i - index} words after its start`);
  let prev = -1;
  for (let k = index - 1; k >= 0 && prev < 0; k--) prev = pairOf[k];
  const j = Math.max(pairOf[i] - (i - index), prev + 1);
  // Start a moment before the first word, so the chapter doesn't clip it.
  return { startTime: Math.max(0, Math.floor((heard[j].start - 0.3) * 10) / 10), title };
});
timed.forEach((ch, c) => {
  if (c && ch.startTime <= timed[c - 1].startTime) throw new Error(`"${ch.title}" doesn't start after "${timed[c - 1].title}"`);
});
const duration = front.podcast.duration;
if (duration && timed.at(-1).startTime >= duration) throw new Error(`"${timed.at(-1).title}" starts after the episode ends`);

const out = join(ROOT, 'chapters', `${slug}.json`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({
  version: '1.2.0',
  title: String(front.title),
  podcastName: 'Manual Focus',
  chapters: timed,
}, null, 2) + '\n');

const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
console.log(`Wrote podcast/chapters/${slug}.json (${matched} of ${n} script words matched)`);
for (const ch of timed) console.log(`  ${clock(ch.startTime).padStart(5)}  ${ch.title}`);
for (const w of warnings) console.log(`  ! ${w}`);

// ElevenLabs Speech to Text on the published MP3, with word timestamps. curl,
// as in http.mjs, so a cloud session's proxy adds the key; locally the key
// goes in a header file so it stays out of the process list.
function transcribe(url, dest) {
  const dir = mkdtempSync(join(tmpdir(), 'podcast-stt-'));
  try {
    const mp3 = join(dir, 'episode.mp3');
    execFileSync('curl', ['-sSfL', url, '-o', mp3]);
    const args = ['-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text',
      '-F', 'model_id=scribe_v1', '-F', 'language_code=en', '-F', 'timestamps_granularity=word',
      '-F', 'tag_audio_events=false', '-F', `file=@${mp3};type=audio/mpeg`,
      '-o', join(dir, 'body'), '-w', '%{http_code}'];
    if (process.env.ELEVENLABS_API_KEY) {
      writeFileSync(join(dir, 'headers'), `xi-api-key: ${process.env.ELEVENLABS_API_KEY}\n`, { mode: 0o600 });
      args.push('-H', `@${join(dir, 'headers')}`);
    }
    console.log(`Transcribing ${url} ...`);
    const status = Number(execFileSync('curl', args).toString().trim());
    const body = readFileSync(join(dir, 'body'), 'utf8');
    if (status < 200 || status >= 300) throw new Error(`ElevenLabs Speech to Text returned ${status}: ${body.slice(0, 300)}`);
    writeFileSync(dest, body);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
