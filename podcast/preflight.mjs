#!/usr/bin/env node
// Checks that this machine can build and publish an episode, without spending
// any ElevenLabs credit or touching the release. The AI briefing runs it
// before voicing anything, so a missing key or tool skips the episode instead
// of failing the briefing.
//
// Usage: node podcast/preflight.mjs [<slug>]
// Prints READY, or SKIP with one line per missing piece. Exits 0 when ready
// and 1 when not. With a slug it also looks for an episode that already
// exists or is in flight for that post (a `podcast` block on the post, an MP3
// on the release, an open PR touching its script), so two runs don't voice and
// upload over each other. It lists those under EXISTING and exits 2.

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { request } from './http.mjs';

const REPO = 'Scylark/manual-focus';
const missing = [];

// ElevenLabs: look up James's voice, which needs a working key and confirms
// the voice exists. Locally the key comes from ELEVENLABS_API_KEY; in a cloud
// session it's a network secret the agent proxy adds, so the env var is unset.
const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_JAMES_VOICE || '9uOKe1BPuYSPsgUcIJd5';
try {
  const res = request(`https://api.elevenlabs.io/v1/voices/${voice}`);
  if (res.status === 401 || res.status === 403) {
    missing.push(key
      ? `ElevenLabs rejected ELEVENLABS_API_KEY (${res.status})`
      : `No ElevenLabs key: set ELEVENLABS_API_KEY, or add it as a network secret for api.elevenlabs.io (${res.status})`);
  } else if (res.status !== 200) {
    missing.push(`ElevenLabs answered ${res.status} for James's voice`);
  }
} catch (err) {
  missing.push(`Can't reach api.elevenlabs.io (${err.stderr?.toString().trim() || err.message})`);
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

for (const tool of ['ffmpeg', 'ffprobe']) {
  try {
    run(tool, ['-version']);
  } catch {
    missing.push(`${tool} is not on the PATH`);
  }
}

// publish-episode.mjs needs push rights on the repo (it uploads to the release,
// or pushes a podcast-audio/ branch for the Action to upload) and an existing
// "podcast" release.
try {
  const canPush = run('gh', ['api', `repos/${REPO}`, '--jq', '.permissions.push']);
  if (canPush !== 'true') {
    missing.push(`gh is signed in without write access to ${REPO}`);
  } else {
    try {
      // REST only: the cloud's GitHub proxy refuses GraphQL, which `gh release view` uses.
      run('gh', ['api', `repos/${REPO}/releases/tags/podcast`, '--jq', '.tag_name']);
    } catch {
      missing.push(`the "podcast" release doesn't exist on ${REPO}`);
    }
  }
} catch (err) {
  missing.push(err.code === 'ENOENT' ? 'the gh CLI is not installed' : `gh can't reach ${REPO} (not signed in, or no access)`);
}

if (missing.length) {
  console.log(`SKIP\n${missing.map((m) => `- ${m}`).join('\n')}`);
  process.exit(1);
}

const slug = process.argv[2];
const existing = [];
if (slug) {
  const post = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'blog', `${slug}.md`);
  if (existsSync(post) && /^podcast:$/m.test(readFileSync(post, 'utf8').split(/^---$/m)[1] ?? '')) {
    existing.push(`the post already has a podcast block on this branch`);
  }
  const assets = run('gh', ['api', `repos/${REPO}/releases/tags/podcast`, '--jq', '.assets[].name'])
    .split('\n').filter((name) => name === `${slug}.mp3` || name.startsWith(`${slug}-`));
  for (const name of assets) existing.push(`the release already has ${name}`);
  // REST only: the cloud's GitHub proxy refuses GraphQL, so no `gh pr list`.
  const prs = JSON.parse(run('gh', ['api', `repos/${REPO}/pulls?state=open&per_page=50`, '--jq', '[.[] | {number, title, branch: .head.ref}]']));
  // The PR for the branch we're on is this run's own work, not another run's.
  let branch = '';
  try { branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']); } catch {}
  for (const pr of prs.filter((p) => p.branch !== branch)) {
    const files = run('gh', ['api', `repos/${REPO}/pulls/${pr.number}/files?per_page=100`, '--jq', '.[].filename']).split('\n');
    if (files.includes(`podcast/scripts/${slug}.txt`)) existing.push(`open PR #${pr.number} (${pr.title}) has an episode for it`);
  }
}
if (existing.length) {
  console.log(`EXISTING\n${existing.map((m) => `- ${m}`).join('\n')}`);
  process.exit(2);
}
console.log('READY');
