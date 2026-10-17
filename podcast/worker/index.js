// Serves episode MP3s from R2 with the headers podcast apps expect:
// audio/mpeg, byte-range support (HTTP 206) and HEAD requests. Apple
// Podcasts rejects audio served as a generic download, which is why the
// episodes moved here from GitHub release assets.

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
    }

    const key = decodeURIComponent(new URL(request.url).pathname.slice(1));
    if (!/^episodes\/[a-z0-9-]+\.mp3$/.test(key)) {
      return new Response('Not found', { status: 404 });
    }

    // Parse the Range header ourselves so the 206 headers always match the
    // bytes sent. Browsers stream audio with ranges (usually "bytes=0-"), and a
    // malformed Content-Range makes them refuse to play.
    const head = await env.AUDIO.head(key);
    if (!head) return new Response('Not found', { status: 404 });
    const size = head.size;

    const headers = new Headers();
    head.writeHttpMetadata(headers);
    headers.set('content-type', 'audio/mpeg');
    headers.set('accept-ranges', 'bytes');
    headers.set('etag', head.httpEtag);
    headers.set('cache-control', 'public, max-age=86400');
    headers.set('access-control-allow-origin', '*');
    headers.set('access-control-expose-headers', 'content-length, content-range, accept-ranges');

    const range = parseRange(request.headers.get('range'), size);
    if (range === 'invalid') {
      headers.set('content-range', `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }

    if (request.method === 'HEAD') {
      headers.set('content-length', String(size));
      return new Response(null, { headers });
    }

    if (range) {
      const object = await env.AUDIO.get(key, { range: { offset: range.start, length: range.end - range.start + 1 } });
      if (!object) return new Response('Not found', { status: 404 });
      headers.set('content-range', `bytes ${range.start}-${range.end}/${size}`);
      headers.set('content-length', String(range.end - range.start + 1));
      return new Response(object.body, { status: 206, headers });
    }

    const object = await env.AUDIO.get(key);
    if (!object) return new Response('Not found', { status: 404 });
    headers.set('content-length', String(size));
    return new Response(object.body, { headers });
  },
};

// "bytes=start-end", "bytes=start-" or "bytes=-suffix". Returns null when there's
// no usable Range header (serve the whole file), or 'invalid' when it can't be
// satisfied. Multi-range requests get the whole file.
function parseRange(header, size) {
  const m = header && /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start, end;
  if (m[1] === '') {
    const suffix = Number(m[2]);
    if (suffix === 0) return 'invalid';
    start = Math.max(size - suffix, 0);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) return 'invalid';
  return { start, end };
}
