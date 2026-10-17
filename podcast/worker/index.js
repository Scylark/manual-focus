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

    const object = request.method === 'HEAD'
      ? await env.AUDIO.head(key)
      : await env.AUDIO.get(key, { range: request.headers, onlyIf: request.headers });
    if (!object) return new Response('Not found', { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('content-type', 'audio/mpeg');
    headers.set('accept-ranges', 'bytes');
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=86400');
    headers.set('access-control-allow-origin', '*');

    // A failed conditional request returns metadata but no body.
    if (request.method === 'GET' && !('body' in object)) {
      return new Response(null, { status: 304, headers });
    }

    const range = object.range;
    if (request.method === 'GET' && range && request.headers.has('range')) {
      const start = 'suffix' in range ? object.size - range.suffix : range.offset ?? 0;
      const length = 'suffix' in range ? range.suffix : range.length ?? object.size - start;
      headers.set('content-range', `bytes ${start}-${start + length - 1}/${object.size}`);
      headers.set('content-length', String(length));
      return new Response(object.body, { status: 206, headers });
    }

    headers.set('content-length', String(object.size));
    return new Response(request.method === 'HEAD' ? null : object.body, { headers });
  },
};
