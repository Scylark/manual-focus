#!/usr/bin/env node
// Checks that this machine can build and publish an episode, without spending
// any ElevenLabs credit or touching the release. The AI briefing runs it
// before voicing anything, so a missing key or tool skips the episode instead
// of failing the briefing.
//
// Usage: node podcast/preflight.mjs
// Prints READY, or SKIP with one line per missing piece. Exits 0 when ready
// and 1 when not.

import { execFileSync } from 'node:child_process';

const REPO = 'Scylark/manual-focus';
const missing = [];

// The voice IDs default to the show's voices in build-episode.mjs.
if (!process.env.ELEVENLABS_API_KEY) missing.push('ELEVENLABS_API_KEY is not set');

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

for (const tool of ['ffmpeg', 'ffprobe']) {
  try {
    run(tool, ['-version']);
  } catch {
    missing.push(`${tool} is not on the PATH`);
  }
}

// publish-episode.mjs uploads with `gh release upload`, which needs push
// rights on the repo and an existing "podcast" release.
try {
  const canPush = run('gh', ['api', `repos/${REPO}`, '--jq', '.permissions.push']);
  if (canPush !== 'true') {
    missing.push(`gh is signed in without write access to ${REPO}`);
  } else {
    try {
      run('gh', ['release', 'view', 'podcast', '--repo', REPO, '--json', 'tagName']);
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
console.log('READY');
