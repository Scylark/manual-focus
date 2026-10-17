// HTTP for the podcast scripts, through curl rather than Node's fetch.
//
// In a cloud session the ElevenLabs key is a network secret that Anthropic's
// agent proxy adds to requests for api.elevenlabs.io. curl honours the
// session's HTTPS_PROXY and CA settings; Node's fetch doesn't, so its requests
// never reach the proxy and arrive without a key. Locally, ELEVENLABS_API_KEY
// is passed in a header file, so it never shows up in the process list.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Returns { status, body } where body is a Buffer, or writes the body to
// `out` when given. Never throws on an HTTP error status.
export function request(url, { method = 'GET', json, out } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'podcast-http-'));
  const bodyFile = out ?? join(dir, 'body');
  const args = ['-sS', '-X', method, url, '-o', bodyFile, '-w', '%{http_code}'];
  const headers = [];
  if (process.env.ELEVENLABS_API_KEY && new URL(url).host === 'api.elevenlabs.io') {
    headers.push(`xi-api-key: ${process.env.ELEVENLABS_API_KEY}`);
  }
  if (json !== undefined) headers.push('content-type: application/json');
  if (headers.length) {
    const headerFile = join(dir, 'headers');
    writeFileSync(headerFile, headers.join('\n') + '\n', { mode: 0o600 });
    args.push('-H', `@${headerFile}`);
  }
  if (json !== undefined) args.push('--data-binary', '@-');
  try {
    const status = Number(execFileSync('curl', args, {
      input: json === undefined ? undefined : JSON.stringify(json),
      stdio: ['pipe', 'pipe', 'pipe'],
    }).toString().trim());
    const body = existsSync(bodyFile) ? readFileSync(bodyFile) : Buffer.alloc(0);
    if (out && (status < 200 || status >= 300)) rmSync(out, { force: true });
    return { status, body };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
