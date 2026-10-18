#!/usr/bin/env node
// Cuts one or two vertical clips (1080x1920, 30 to 60 seconds) from a
// podcast episode for YouTube Shorts and LinkedIn, with their copy.
//
// 1. Choosing. Claude reads the script, show notes and post against the
//    rubric in podcast/clip-prompt.md and picks whole-sentence passages that
//    make sense cold, preferring a sharp "so what" or a "Get AI on this" job,
//    and writes the Shorts title and description and a LinkedIn draft. The
//    choice and copy are saved to podcast/clips/<slug>.json, which is kept in
//    git so James can read and edit it in the PR; later runs reuse it. Pass
//    --repick to ask Claude again. It runs through the `claude` CLI; if that
//    isn't signed in (or in a cloud session), the script writes the full
//    prompt to podcast/out/clips/<slug>/pick-prompt.md and stops with exit
//    code 2. The Claude session running the job answers that prompt itself,
//    saves the JSON answer as podcast/clips/<slug>.json and reruns.
// 2. Timing. ElevenLabs forced alignment matches the script's words to the
//    published episode MP3 and returns each word's start and end. That's more
//    exact than Speech to Text, because the script already says what was said
//    and how every name is spelt. The passage is cut on word boundaries with
//    short fades. Clips come from the middle of the episode, so the music bed
//    is only in them if it was under that section already.
// 3. Video. podcast/clip-graphics.py draws the type and the rings with Pillow
//    (this ffmpeg has no text filters); ffmpeg adds the waveform, the progress
//    bar and the end card, and burns in the captions a few words at a time.
// 4. Output in podcast/out/clips/<slug>/ (git ignores podcast/out/):
//    <slug>-<n>.mp4, <slug>-<n>.jpg (a frame for review) and <slug>-<n>.md
//    (the copy, ready to paste).
//
// Usage: node podcast/make-clips.mjs <slug> [--repick] [--pick-only]
// --pick-only stops after the choice, so it needs no ElevenLabs key.
// Needs: the `claude` CLI (for a new pick), ELEVENLABS_API_KEY, ffmpeg,
// python3 with Pillow, and macOS's Arial Narrow and Menlo fonts.

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { request } from './http.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://manual-focus.co.uk';
const FPS = 30;
const END_CARD = 4; // seconds of end card after the last word
const MIN_TOTAL = 30;
const MAX_TOTAL = 60;
const LEAD_IN = 0.12; // audio kept before the first word
const TAIL = 0.35; // audio kept after the last word
const FADE_IN = 0.06;
const FADE_OUT = 0.2;
const CAPTION_WORDS = 4; // at most this many words on screen at once
const CAPTION_CHARS = 24;
// Must match clip-graphics.py.
const MARGIN = 90;
const WAVE = { y: 965, h: 140 };
const CAPTION_Y = 1150;

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const repick = args.includes('--repick');
const pickOnly = args.includes('--pick-only');
if (!slug) throw new Error('Usage: node podcast/make-clips.mjs <slug> [--repick] [--pick-only]');

const paths = {
  script: join(ROOT, 'scripts', `${slug}.txt`),
  notes: join(ROOT, 'notes', `${slug}.md`),
  post: join(ROOT, '..', 'src', 'content', 'blog', `${slug}.md`),
  choice: join(ROOT, 'clips', `${slug}.json`),
  out: join(ROOT, 'out', 'clips', slug),
};
for (const what of ['script', 'notes', 'post']) {
  if (!existsSync(paths[what])) throw new Error(`No ${what} at ${paths[what]}`);
}

const post = yaml.load(readFileSync(paths.post, 'utf8').split(/^---$/m)[1]);
const postUrl = `${SITE}/blog/${slug}/`;

// The script as turns, sentences and words. Audio tags aren't spoken, so
// they're dropped; every word keeps its index in the whole episode so it can
// be matched to the alignment.
const turns = readFileSync(paths.script, 'utf8')
  .split(/\n\s*\n/)
  .map((b) => b.trim())
  .filter(Boolean)
  .map((block, i) => {
    const m = block.match(/^(JAMES|HANNAH):\s*([\s\S]+)$/);
    if (!m) throw new Error(`Turn ${i + 1} has no JAMES:/HANNAH: speaker`);
    return { speaker: m[1], text: m[2].replace(/\[[^\]]*\]\s*/g, '').replace(/\s+/g, ' ').trim() };
  });

const words = [];
const sentences = new Map(); // "turn.sentence" -> { first, last } word indexes
for (const [t, turn] of turns.entries()) {
  // A sentence ends at . ? ! (or a closing quote after one) followed by a
  // space and a capital, so "Dr. Smith" style breaks are rare enough to ignore.
  const parts = turn.text.split(/(?<=[.?!]["”’]?)\s+(?=["“‘]?[A-Z0-9])/);
  for (const [s, part] of parts.entries()) {
    const first = words.length;
    for (const w of part.split(' ')) words.push({ text: w, speaker: turn.speaker, turn: t });
    sentences.set(`${t + 1}.${s + 1}`, { first, last: words.length - 1, text: part, speaker: turn.speaker });
  }
}

// ---- 1. Choose the passages ---------------------------------------------

function numberedScript() {
  const lines = [];
  let turn = -1;
  for (const [key, s] of sentences) {
    const t = Number(key.split('.')[0]);
    if (t !== turn) {
      lines.push('');
      turn = t;
    }
    lines.push(`[${key}] ${s.speaker}: ${s.text}`);
  }
  return lines.join('\n').trim();
}

function pick() {
  const prompt = [
    readFileSync(join(ROOT, 'clip-prompt.md'), 'utf8'),
    '---',
    `Post title: ${post.title}`,
    `Post URL: ${postUrl}`,
    `Post description: ${post.description}`,
    '',
    'Show notes:',
    readFileSync(paths.notes, 'utf8'),
    '',
    'Script, numbered [turn.sentence]:',
    numberedScript(),
  ].join('\n');
  process.stdout.write('Asking Claude to pick the clips...\n');
  let raw;
  try {
    raw = execFileSync('claude', ['-p', '--output-format', 'text', '--tools', '', '--no-session-persistence'], {
      input: prompt, maxBuffer: 10 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'],
    }).toString();
  } catch (err) {
    mkdirSync(paths.out, { recursive: true });
    const file = join(paths.out, 'pick-prompt.md');
    writeFileSync(file, prompt);
    console.log(`The claude CLI couldn't answer (${String(err.stdout || err.message).trim().split('\n')[0]}).`);
    console.log(`PICK NEEDED: answer ${file} and save the JSON to ${paths.choice}, then rerun.`);
    process.exit(2);
  }
  const json = raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
  let answer;
  try {
    answer = JSON.parse(json);
  } catch {
    throw new Error(`Claude's answer wasn't JSON:\n${raw}`);
  }
  if (!Array.isArray(answer.clips) || !answer.clips.length) throw new Error(`No clips in Claude's answer:\n${raw}`);
  return answer;
}

function passage(clip) {
  const from = sentences.get(clip.from);
  const to = sentences.get(clip.to);
  if (!from || !to) throw new Error(`Clip ${clip.from} to ${clip.to} names a sentence the script doesn't have`);
  if (to.last < from.first) throw new Error(`Clip ${clip.from} to ${clip.to} runs backwards`);
  return { first: from.first, last: to.last };
}

// Copy rules from clip-prompt.md that a machine can check. Labels in the
// description's fixed lines are the only colons allowed.
function copyProblems(clip) {
  const problems = [];
  const fixed = /^(Full episode and article|Listen on|The voices are)/;
  const prose = [clip.hook, clip.youtube.title, clip.linkedin,
    ...clip.youtube.description.split('\n').filter((l) => !fixed.test(l))].join('\n');
  if (/—|–/.test(prose)) problems.push('a dash');
  if (/;/.test(prose)) problems.push('a semicolon');
  if (/:(?!\/\/)/.test(prose)) problems.push('a colon');
  if (/!/.test(prose)) problems.push('an exclamation mark');
  if (clip.youtube.title.length > 70) problems.push('a title over 70 characters');
  if (!clip.youtube.description.includes(postUrl)) problems.push('no post link in the description');
  if (!/#Shorts/.test(clip.youtube.description)) problems.push('no #Shorts');
  if (!/AI-generated/i.test(clip.linkedin)) problems.push('no AI-voices line in the LinkedIn post');
  const banned = /\b(delve|foster|leverage|utili[sz]e|facilitate|empower|streamline|robust|cutting-edge|game[- ]changer|transformative|elevate|unlock|supercharge|harness|landscape)\b/i;
  const hit = prose.match(banned);
  if (hit) problems.push(`"${hit[0]}"`);
  return problems;
}

mkdirSync(join(ROOT, 'clips'), { recursive: true });
let choice = existsSync(paths.choice) && !repick ? JSON.parse(readFileSync(paths.choice, 'utf8')) : null;
// A bare answer saved by hand (just { clips }) is filled out like a fresh
// one. The passage text is refreshed every run, so editing from/to in the
// file keeps it in step.
const answer = choice ?? pick();
const filled = {
  slug,
  title: post.title,
  url: postUrl,
  clips: answer.clips.slice(0, 2).map((c) => {
    const { first, last } = passage(c);
    return { ...c, words: last - first + 1, text: words.slice(first, last + 1).map((w) => w.text).join(' ') };
  }),
};
if (JSON.stringify(filled) !== JSON.stringify(choice)) {
  writeFileSync(paths.choice, JSON.stringify(filled, null, 2) + '\n');
  console.log(`Saved the choice to ${paths.choice}`);
}
choice = filled;
for (const [i, clip] of choice.clips.entries()) {
  const { first, last } = passage(clip);
  console.log(`Clip ${i + 1}: [${clip.from}] to [${clip.to}], ${last - first + 1} words. ${clip.why}`);
  const problems = copyProblems(clip);
  if (last - first + 1 < 65 || last - first + 1 > 150) problems.unshift(`a passage of ${last - first + 1} words (65 to 150)`);
  if (problems.length) console.log(`  WARN clip has ${problems.join(', ')}; fix it in ${paths.choice}`);
}
if (pickOnly) process.exit(0);

// ---- 2. Time the words --------------------------------------------------

mkdirSync(paths.out, { recursive: true });

// The published MP3 is what listeners heard, so prefer it; a post that isn't
// published yet uses the local build.
const episode = join(paths.out, 'episode.mp3');
if (!existsSync(episode)) {
  if (post.podcast?.audio) {
    console.log(`Downloading ${post.podcast.audio}`);
    const res = request(post.podcast.audio, { out: episode });
    if (res.status !== 200) throw new Error(`Couldn't download the episode (${res.status})`);
  } else if (existsSync(join(ROOT, 'out', `${slug}.mp3`))) {
    execFileSync('cp', [join(ROOT, 'out', `${slug}.mp3`), episode]);
  } else {
    throw new Error(`No audio: the post has no podcast block and podcast/out/${slug}.mp3 doesn't exist`);
  }
}

const transcript = turns.map((t) => t.text).join('\n');
const alignKey = createHash('sha1').update(transcript).update(String(statSync(episode).size)).digest('hex').slice(0, 12);
const alignFile = join(paths.out, `alignment-${alignKey}.json`);
if (!existsSync(alignFile)) {
  console.log('Aligning the script to the audio with ElevenLabs...');
  const res = request('https://api.elevenlabs.io/v1/forced-alignment', {
    method: 'POST', form: { file: `@${episode}`, text: transcript }, out: alignFile,
  });
  if (res.status !== 200) throw new Error(`Forced alignment failed (${res.status}): ${res.body.toString().slice(0, 500)}`);
}
const aligned = JSON.parse(readFileSync(alignFile, 'utf8')).words.filter((w) => w.text.trim());
if (aligned.length !== words.length) {
  throw new Error(`Alignment has ${aligned.length} words, the script ${words.length}; delete ${alignFile} and rerun`);
}
for (const [i, w] of words.entries()) Object.assign(w, { start: aligned[i].start, end: aligned[i].end });

// ---- 3. Cut and render --------------------------------------------------

const ffmpeg = (a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: ['ignore', 'inherit', 'inherit'] });

// Caption states: the clip's words in groups of a few, never across a change
// of speaker or a sentence end, with one state per spoken word so the word
// being said is lit. Each state lasts until the next word starts.
function captionStates(clipWords, clipStart, speechEnd) {
  const groups = [];
  let group = [];
  for (const w of clipWords) {
    const chars = group.reduce((n, g) => n + g.text.length + 1, 0) + w.text.length;
    if (group.length && (group.length >= CAPTION_WORDS || chars > CAPTION_CHARS || w.speaker !== group[0].speaker)) {
      groups.push(group);
      group = [];
    }
    group.push(w);
    if (/[.?!,]["”’]?$/.test(w.text) && group.length >= 2) {
      groups.push(group);
      group = [];
    } else if (/[.?!—]["”’]?$/.test(w.text)) {
      groups.push(group);
      group = [];
    }
  }
  if (group.length) groups.push(group);

  const states = [];
  const flat = groups.flatMap((g) => g.map((w, i) => ({ g, i })));
  for (const [k, { g, i }] of flat.entries()) {
    const at = (k === 0 ? 0 : g[i].start - clipStart);
    const until = k + 1 < flat.length ? flat[k + 1].g[flat[k + 1].i].start - clipStart : speechEnd;
    states.push({ speaker: g[0].speaker, words: g.map((w) => w.text), active: i, at, until });
  }
  return states;
}

const clipFiles = [];
for (const [n, clip] of choice.clips.entries()) {
  const name = `${slug}-${n + 1}`;
  const work = join(paths.out, `work-${n + 1}`);
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });

  const { first, last } = passage(clip);
  const clipWords = words.slice(first, last + 1);
  const before = words[first - 1];
  const after = words[last + 1];
  const start = Math.max(clipWords[0].start - LEAD_IN, before ? before.end + 0.02 : 0);
  const end = Math.min(clipWords.at(-1).end + TAIL, after ? after.start - 0.03 : Infinity);
  const speech = end - start;
  const total = speech + END_CARD;
  if (total < MIN_TOTAL || total > MAX_TOTAL) {
    throw new Error(`Clip ${n + 1} would run ${total.toFixed(1)}s with its end card (limits ${MIN_TOTAL} to ${MAX_TOTAL}). Edit from/to in ${paths.choice} or rerun with --repick.`);
  }

  const audio = join(work, 'audio.wav');
  ffmpeg(['-ss', start.toFixed(3), '-to', end.toFixed(3), '-i', episode,
    '-af', `afade=t=in:d=${FADE_IN},afade=t=out:st=${(speech - FADE_OUT).toFixed(3)}:d=${FADE_OUT},apad=whole_dur=${total.toFixed(3)}`,
    '-ac', '1', '-ar', '44100', audio]);

  const states = captionStates(clipWords, start, speech);
  writeFileSync(join(work, 'spec.json'), JSON.stringify({ out: work, title: post.title, states }));
  execFileSync('python3', [join(ROOT, 'clip-graphics.py'), join(work, 'spec.json')], { stdio: 'inherit' });

  // Captions as a timed image sequence: blank before the first word (and
  // under the end card), then one image per state.
  execFileSync('python3', ['-c', 'from PIL import Image; Image.new("RGBA",(1080,300),(0,0,0,0)).save(__import__("sys").argv[1])', join(work, 'blank.png')]);
  const list = ['ffconcat version 1.0'];
  const entry = (file, d) => list.push(`file '${file}'`, `duration ${Math.max(d, 1 / FPS).toFixed(3)}`);
  if (states[0].at > 0) entry(join(work, 'blank.png'), states[0].at);
  states.forEach((s, i) => entry(join(work, `cap-${String(i).padStart(3, '0')}.png`), s.until - s.at));
  entry(join(work, 'blank.png'), END_CARD);
  list.push(`file '${join(work, 'blank.png')}'`);
  writeFileSync(join(work, 'captions.txt'), list.join('\n') + '\n');

  const waveW = 1080 - 2 * MARGIN;
  const filter = [
    `[1:a]asplit[a][w]`,
    `[w]volume=3,showwaves=s=${waveW}x${WAVE.h}:mode=cline:rate=${FPS}:colors=white:scale=sqrt:draw=full,format=gray[wmask]`,
    `[3:v]format=rgba[wgrad]`,
    `[wgrad][wmask]alphamerge,colorchannelmixer=aa=0.85[wave]`,
    `[0:v][wave]overlay=x=${MARGIN}:y=${WAVE.y}:shortest=0:enable='lt(t,${speech.toFixed(3)})'[v1]`,
    `[2:v]fps=${FPS},format=rgba[caps]`,
    `[v1][caps]overlay=x=0:y=${CAPTION_Y}:eof_action=pass[v2]`,
    `[v2][4:v]overlay=x='W*min(t/${speech.toFixed(3)},1)':y=0[v3]`,
    `[5:v]format=rgba,fade=t=in:st=${speech.toFixed(3)}:d=0.5:alpha=1[end]`,
    `[v3][end]overlay=enable='gte(t,${speech.toFixed(3)})'[v]`,
  ].join(';');
  const mp4 = join(paths.out, `${name}.mp4`);
  ffmpeg([
    '-loop', '1', '-framerate', String(FPS), '-i', join(work, 'bg.png'),
    '-i', audio,
    '-f', 'concat', '-safe', '0', '-i', join(work, 'captions.txt'),
    '-loop', '1', '-framerate', String(FPS), '-i', join(work, 'wave.png'),
    '-loop', '1', '-framerate', String(FPS), '-i', join(work, 'bar.png'),
    '-loop', '1', '-framerate', String(FPS), '-i', join(work, 'endcard.png'),
    '-filter_complex', filter, '-map', '[v]', '-map', '[a]',
    '-t', total.toFixed(3), '-r', String(FPS),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', mp4,
  ]);

  // A frame from the middle of the clip, for review.
  ffmpeg(['-ss', (speech * 0.4).toFixed(2), '-i', mp4, '-frames:v', '1', '-q:v', '3', join(paths.out, `${name}.jpg`)]);

  const copy = [
    `# ${name}`,
    '',
    `${clip.from} to ${clip.to}, ${total.toFixed(0)} seconds. ${clip.why}`,
    '',
    '## YouTube Shorts',
    '',
    `**Title:** ${clip.youtube.title}`,
    '',
    '**Description:**',
    '',
    clip.youtube.description,
    '',
    '## LinkedIn',
    '',
    clip.linkedin,
    '',
  ].join('\n');
  writeFileSync(join(paths.out, `${name}.md`), copy);
  rmSync(work, { recursive: true, force: true });
  clipFiles.push(`${mp4} (${total.toFixed(1)}s)`);
}

console.log(`Wrote:\n  ${clipFiles.join('\n  ')}\nCopy and review frames are beside them in ${paths.out}`);
