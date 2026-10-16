#!/usr/bin/env node
// Turns a two-host script (podcast/scripts/<slug>.txt) into an MP3 episode.
//
// The script is voiced with ElevenLabs Text to Dialogue (eleven_v3), which
// performs a run of turns together so the hosts react to each other rather
// than each line being read cold. The API takes about 2,000 characters per
// request, so turns are grouped into chunks under that and ffmpeg joins the
// chunks and normalises loudness. Chunks are cached in podcast/out/<slug>/, so editing
// one line only re-voices its chunk.
//
// Every episode uses the same music, podcast/music/road-at-dawn.mp3: the
// track's opening plays alone for a few seconds, then dips under James's cold
// open and fades away; the track's closing section comes in quietly under the
// last lines and rises to its natural ending once James stops talking.
// There's no fixed jingle or voiceover; the cold open is different each time.
//
// Usage: node podcast/build-episode.mjs <slug> [--dry-run]
// --dry-run parses and chunks the script and prints the plan, without calling
// ElevenLabs or ffmpeg, so it needs no key.
// Needs an ElevenLabs key (ELEVENLABS_API_KEY locally, a network secret in the
// cloud) and ffmpeg on the PATH. ELEVENLABS_JAMES_VOICE and
// ELEVENLABS_HANNAH_VOICE optionally override the show's voices.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const MODEL = 'eleven_v3';
const CHUNK_CHARS = 1800; // headroom under the API's 2,000-character limit
const SEED = 1162; // fixed, so re-voicing an unchanged chunk sounds the same
const PAUSE_SECONDS = 0.25; // between chunks only; the model paces turns itself
// eleven_v3 stability: 0 is the most expressive, 0.5 natural, 1 the steadiest.
// Kept on the steady side so James doesn't come across over-excited.
const STABILITY = Number(process.env.PODCAST_STABILITY ?? 0.5);

// Music, in seconds within road-at-dawn.mp3 and on the episode timeline.
const MUSIC = join(ROOT, 'music', 'road-at-dawn.mp3');
const INTRO = { from: 0, to: 30, speechAt: 6, duckAt: 5, fadeAt: 24 };
const OUTRO = { from: 148.5, to: 173.7, underLast: 12 };
const FULL = 0.85; // music on its own, just under the voices
const BED = 0.1; // music under speech

const apiKey = process.env.ELEVENLABS_API_KEY;
// Voice IDs aren't secret (they only work with the account's API key), so the
// show's voices are the defaults and the env vars only override them.
const VOICES = {
  JAMES: process.env.ELEVENLABS_JAMES_VOICE || '9uOKe1BPuYSPsgUcIJd5', // James's clone
  HANNAH: process.env.ELEVENLABS_HANNAH_VOICE || 'y1LQSw6x4O5I1qZEI77j',
};

const dryRun = process.argv.includes('--dry-run');
const slug = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!slug) throw new Error('Usage: node podcast/build-episode.mjs <slug> [--dry-run]');
// In a cloud session the key is a network secret: the agent proxy adds the
// xi-api-key header to requests for api.elevenlabs.io, so the session never
// sees it and ELEVENLABS_API_KEY is unset. Run podcast/preflight.mjs to check
// that a key reaches ElevenLabs either way.
const authHeaders = apiKey ? { 'xi-api-key': apiKey } : {};

const script = readFileSync(join(ROOT, 'scripts', `${slug}.txt`), 'utf8');
const turns = script
  .split(/\n\s*\n/)
  .map((block) => block.trim())
  .filter(Boolean)
  .map((block, i) => {
    const m = block.match(/^(JAMES|HANNAH):\s*([\s\S]+)$/);
    if (!m) throw new Error(`Turn ${i + 1} has no JAMES:/HANNAH: speaker:\n${block}`);
    return { speaker: m[1], text: m[2].replace(/\s+/g, ' ') };
  });

// Group whole turns into chunks under the character limit.
const chunks = [];
let current = [];
let size = 0;
for (const turn of turns) {
  if (turn.text.length > CHUNK_CHARS) throw new Error(`A ${turn.speaker} turn is over ${CHUNK_CHARS} characters; split it.`);
  if (size + turn.text.length > CHUNK_CHARS && current.length) {
    chunks.push(current);
    current = [];
    size = 0;
  }
  current.push(turn);
  size += turn.text.length;
}
if (current.length) chunks.push(current);

if (dryRun) {
  for (const [i, chunk] of chunks.entries()) {
    const chars = chunk.reduce((n, t) => n + t.text.length, 0);
    console.log(`Chunk ${i + 1}/${chunks.length}: ${chunk.length} turns, ${chars} chars`);
  }
  const chars = turns.reduce((n, t) => n + t.text.length, 0);
  console.log(`Dry run: ${turns.length} turns, ${chars} characters to voice. Nothing sent to ElevenLabs.`);
  process.exit(0);
}

const outDir = join(ROOT, 'out', slug);
mkdirSync(outDir, { recursive: true });

async function voice(chunk, i) {
  const body = {
    model_id: MODEL,
    inputs: chunk.map((t) => ({ text: t.text, voice_id: VOICES[t.speaker] })),
    seed: SEED,
    settings: { stability: STABILITY },
  };
  const hash = createHash('sha1').update(JSON.stringify(body)).digest('hex').slice(0, 12);
  const file = join(outDir, `chunk-${String(i + 1).padStart(2, '0')}-${hash}.mp3`);
  if (existsSync(file)) return file;

  const res = await fetch('https://api.elevenlabs.io/v1/text-to-dialogue?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { ...authHeaders, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ElevenLabs failed on chunk ${i + 1} (${res.status}): ${await res.text()}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

const files = [];
for (const [i, chunk] of chunks.entries()) {
  const chars = chunk.reduce((n, t) => n + t.text.length, 0);
  process.stdout.write(`Voicing chunk ${i + 1}/${chunks.length} (${chunk.length} turns, ${chars} chars)\n`);
  files.push(await voice(chunk, i));
}

// Join the chunks with a short pause and normalise the speech to -16 LUFS,
// the usual loudness target for podcasts.
const inputs = files.flatMap((f) => ['-i', f]);
const chains = files
  .map((_, i) => `[${i}:a]aresample=44100,aformat=channel_layouts=mono,apad=pad_dur=${PAUSE_SECONDS}[a${i}]`)
  .join(';');
const concat = files.map((_, i) => `[a${i}]`).join('') + `concat=n=${files.length}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
const speech = join(outDir, 'speech.wav');

execFileSync('ffmpeg', [
  '-y', '-loglevel', 'error', ...inputs,
  '-filter_complex', `${chains};${concat}`,
  '-map', '[out]', '-ac', '1', '-ar', '44100', speech,
]);

const duration = (file) => Number(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file,
]).toString().trim());

// Lay the speech and the two music sections on one timeline. Volume curves
// are written as expressions of t (seconds into each section).
const speechEnd = INTRO.speechAt + duration(speech);
const outroStart = speechEnd - OUTRO.underLast;
const introVolume = `if(lt(t,${INTRO.duckAt}),${FULL},if(lt(t,${INTRO.duckAt + 2}),${FULL}-(${FULL}-${BED})*(t-${INTRO.duckAt})/2,${BED}))`;
const outroVolume = `if(lt(t,${OUTRO.underLast}),${BED},if(lt(t,${OUTRO.underLast + 1.5}),${BED}+(${FULL}-${BED})*(t-${OUTRO.underLast})/1.5,${FULL}))`;
const mix = [
  `[0:a]adelay=${INTRO.speechAt * 1000}:all=1[voice]`,
  `[1:a]atrim=${INTRO.from}:${INTRO.to},asetpts=PTS-STARTPTS,aformat=channel_layouts=mono,volume='${introVolume}':eval=frame,afade=t=out:st=${INTRO.fadeAt - INTRO.from}:d=${INTRO.to - INTRO.fadeAt}[intro]`,
  `[2:a]atrim=${OUTRO.from}:${OUTRO.to},asetpts=PTS-STARTPTS,aformat=channel_layouts=mono,volume='${outroVolume}':eval=frame,afade=t=in:d=2,adelay=${Math.round(outroStart * 1000)}:all=1[outro]`,
  `[voice][intro][outro]amix=inputs=3:duration=longest:normalize=0,alimiter=limit=0.89[out]`,
].join(';');
const mp3 = join(ROOT, 'out', `${slug}.mp3`);

execFileSync('ffmpeg', [
  '-y', '-loglevel', 'error', '-i', speech, '-i', MUSIC, '-i', MUSIC,
  '-filter_complex', mix,
  '-map', '[out]', '-ac', '1', '-ar', '44100', '-b:a', '96k', mp3,
]);

const seconds = Math.round(duration(mp3));
console.log(`Wrote ${mp3} (${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')})`);
