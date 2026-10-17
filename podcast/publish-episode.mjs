#!/usr/bin/env node
// Publishes a built episode: uploads podcast/out/<slug>.mp3 to the "podcast"
// GitHub release on Scylark/manual-focus, then writes the episode's URL,
// duration and size into the post's frontmatter so the player and the
// podcast feed (src/pages/podcast.xml.ts) pick it up on the next build.
//
// Audio lives on the release rather than in the site, because a few MB a day
// would push GitHub Pages past its 1 GB limit within months.
//
// Usage: node podcast/publish-episode.mjs <slug> [--dry-run]
// --dry-run uploads nothing and leaves the post alone; it prints the
// frontmatter it would write (with placeholder numbers if there's no MP3 yet).
// Needs the gh CLI signed in with write access to the repo, and ffprobe.
//
// Cloud sessions can't upload release files: GitHub's proxy there passes git
// pushes and REST calls, but not binary uploads. When the direct upload fails,
// the MP3 goes up on a podcast-audio/<name> branch instead, and the
// "Upload podcast audio" Action (.github/workflows/podcast-audio.yml) moves it
// onto the release and deletes the branch. The script waits for the asset to
// appear before it writes the post's frontmatter.
//
// The first upload is <slug>.mp3. A republish never overwrites a live asset
// (`gh release upload --clobber` deletes the old file before uploading, so a
// failed upload would break the player on the live post). It uploads
// <slug>-<UTC timestamp>.mp3 instead and points the post at that. Once the
// post with the new URL is merged, the old asset can be deleted.

import { readFileSync, writeFileSync, statSync, existsSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const REPO = 'Scylark/manual-focus';
const RELEASE = 'podcast';

const dryRun = process.argv.includes('--dry-run');
const slug = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!slug) throw new Error('Usage: node podcast/publish-episode.mjs <slug> [--dry-run]');

const mp3 = join(ROOT, 'out', `${slug}.mp3`);
const post = join(ROOT, '..', 'src', 'content', 'blog', `${slug}.md`);
const haveMp3 = existsSync(mp3);
if (!haveMp3 && !dryRun) throw new Error(`No episode at ${mp3}; run build-episode.mjs first`);
if (!existsSync(post)) throw new Error(`No post at ${post}`);

// REST only: the cloud's GitHub proxy refuses GraphQL, which `gh release view` uses.
const releaseAssets = () => execFileSync('gh', [
  'api', `repos/${REPO}/releases/tags/${RELEASE}`, '--jq', '.assets[].name',
], { stdio: ['ignore', 'pipe', 'pipe'] }).toString().split('\n');

let assets = [];
try {
  assets = releaseAssets();
} catch (err) {
  if (!dryRun) throw err; // a dry run can go without gh
}
const name = assets.includes(`${slug}.mp3`)
  ? `${slug}-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}.mp3`
  : `${slug}.mp3`;

if (!dryRun) {
  // gh names the asset after the file, so upload a copy with the chosen name.
  const dir = mkdtempSync(join(tmpdir(), 'episode-'));
  const upload = join(dir, name);
  copyFileSync(mp3, upload);
  try {
    execFileSync('gh', ['release', 'upload', RELEASE, upload, '--repo', REPO], { stdio: ['ignore', 'inherit', 'pipe'] });
  } catch (err) {
    console.log(`Direct upload failed (${err.stderr?.toString().trim().split('\n')[0] || err.message}); staging it for the Action.`);
    stage(name);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Pushes the MP3 to podcast-audio/<name> as one commit on top of HEAD, built
// with git plumbing so the working tree and index are untouched. The commit
// carries HEAD's tree, which includes the workflow that does the upload.
function stage(asset) {
  const git = (args, opts = {}) => execFileSync('git', args, { cwd: join(ROOT, '..'), stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString().trim();
  const branch = `podcast-audio/${asset.replace(/\.mp3$/, '')}`;
  const index = join(mkdtempSync(join(tmpdir(), 'episode-index-')), 'index');
  const env = { ...process.env, GIT_INDEX_FILE: index };
  const blob = git(['hash-object', '-w', mp3]);
  git(['read-tree', 'HEAD'], { env });
  git(['update-index', '--add', '--cacheinfo', `100644,${blob},podcast/upload/${asset}`], { env });
  const tree = git(['write-tree'], { env });
  const commit = git(['commit-tree', tree, '-p', 'HEAD', '-m', `Podcast audio: ${asset}`]);
  rmSync(dirname(index), { recursive: true, force: true });
  // `+` replaces a staging branch a failed earlier attempt left behind.
  git(['push', 'origin', `+${commit}:refs/heads/${branch}`]);
  console.log(`Pushed ${branch}; waiting for the Action to upload it.`);

  // The Action usually finishes in under a minute.
  const deadline = Date.now() + 5 * 60 * 1000;
  while (Date.now() < deadline) {
    execFileSync('sleep', ['10']);
    if (releaseAssets().includes(asset)) {
      console.log(`The Action uploaded ${asset} to the release.`);
      return;
    }
  }
  throw new Error(`${asset} wasn't on the release after 5 minutes; check the "Upload podcast audio" Action run for ${branch}`);
}

const audio = `https://github.com/${REPO}/releases/download/${RELEASE}/${name}`;
const bytes = haveMp3 ? statSync(mp3).size : 0;
const duration = haveMp3 ? Math.round(Number(execFileSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3,
]).toString().trim())) : 0;

const src = readFileSync(post, 'utf8');
const [, frontmatter, body] = src.match(/^---\n([\s\S]*?\n)---\n([\s\S]*)$/) ?? [];
if (!frontmatter) throw new Error(`Couldn't read the frontmatter in ${post}`);

// An episode keeps its first publish date when it's re-voiced, so podcast apps
// don't treat a fix as a new episode.
const published = frontmatter.match(/^podcast:\n(?:[ \t]+.*\n)*?[ \t]+published:\s*(\S+)/m)?.[1]
  ?? new Date().toISOString().slice(0, 10);

// Replace any existing podcast block, then add the new one after `description`.
const block = `podcast:\n  audio: "${audio}"\n  duration: ${duration}\n  bytes: ${bytes}\n  published: ${published}\n`;
const cleaned = frontmatter.replace(/^podcast:\n(?:[ \t]+.*\n)*/m, '');
const withPodcast = cleaned.replace(/^(description:.*\n)/m, `$1${block}`);
if (withPodcast === cleaned) throw new Error(`No description line in ${post} to place the podcast block after`);
if (dryRun) {
  console.log(`Dry run: nothing uploaded, ${post} unchanged. It would get:\n${block}`);
  process.exit(0);
}
writeFileSync(post, `---\n${withPodcast}---\n${body}`);

console.log(`Published ${audio} (${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}, ${(bytes / 1e6).toFixed(1)} MB)`);
console.log(`Updated ${post}`);
