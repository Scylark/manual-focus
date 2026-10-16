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

// ElevenLabs: look up James's voice, which needs a working key and confirms
// the voice exists. Locally the key comes from ELEVENLABS_API_KEY; in a cloud
// session it's a network secret the agent proxy adds, so the env var is unset.
const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_JAMES_VOICE || '9uOKe1BPuYSPsgUcIJd5';
try {
  const res = await fetch(`https://api.elevenlabs.io/v1/voices/${voice}`, {
    headers: key ? { 'xi-api-key': key } : {},
  });
  if (res.status === 401 || res.status === 403) {
    missing.push(key
      ? `ElevenLabs rejected ELEVENLABS_API_KEY (${res.status})`
      : `No ElevenLabs key: set ELEVENLABS_API_KEY, or add it as a network secret for api.elevenlabs.io (${res.status})`);
  } else if (!res.ok) {
    missing.push(`ElevenLabs answered ${res.status} for James's voice`);
  }
} catch (err) {
  missing.push(`Can't reach api.elevenlabs.io (${err.cause?.code ?? err.message})`);
}

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
