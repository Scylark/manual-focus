#!/usr/bin/env node
// Publishes a built episode: uploads podcast/out/<slug>.mp3 to the "podcast"
// GitHub release on Scylark/manual-focus, then writes the episode's URL,
// duration and size into the post's frontmatter so the player and the
// podcast feed (src/pages/podcast.xml.ts) pick it up on the next build.
//
// Audio lives on the release rather than in the site, because a few MB a day
// would push GitHub Pages past its 1 GB limit within months.
//
// Usage: node podcast/publish-episode.mjs <slug>
// Needs the gh CLI signed in with write access to the repo, and ffprobe.

import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = 'Scylark/manual-focus';
const RELEASE = 'podcast';

const slug = process.argv[2];
if (!slug) throw new Error('Usage: node podcast/publish-episode.mjs <slug>');

const mp3 = join(ROOT, 'out', `${slug}.mp3`);
const post = join(ROOT, '..', 'src', 'content', 'blog', `${slug}.md`);
if (!existsSync(mp3)) throw new Error(`No episode at ${mp3}; run build-episode.mjs first`);
if (!existsSync(post)) throw new Error(`No post at ${post}`);

execFileSync('gh', ['release', 'upload', RELEASE, mp3, '--clobber', '--repo', REPO], { stdio: 'inherit' });

const audio = `https://github.com/${REPO}/releases/download/${RELEASE}/${slug}.mp3`;
const bytes = statSync(mp3).size;
const duration = Math.round(Number(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3,
]).toString().trim()));

// Replace any existing podcast block, then add the new one after `description`.
const block = `podcast:\n  audio: "${audio}"\n  duration: ${duration}\n  bytes: ${bytes}\n`;
const src = readFileSync(post, 'utf8');
const [, frontmatter, body] = src.match(/^---\n([\s\S]*?\n)---\n([\s\S]*)$/) ?? [];
if (!frontmatter) throw new Error(`Couldn't read the frontmatter in ${post}`);
const cleaned = frontmatter.replace(/^podcast:\n(?:[ \t]+.*\n)*/m, '');
const withPodcast = cleaned.replace(/^(description:.*\n)/m, `$1${block}`);
if (withPodcast === cleaned) throw new Error(`No description line in ${post} to place the podcast block after`);
writeFileSync(post, `---\n${withPodcast}---\n${body}`);

console.log(`Published ${audio} (${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}, ${(bytes / 1e6).toFixed(1)} MB)`);
console.log(`Updated ${post}`);
