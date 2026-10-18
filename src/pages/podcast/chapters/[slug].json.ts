// Podcasting 2.0 chapters for each episode, linked from the podcast feed with
// <podcast:chapters>. podcast/chapters.mjs writes the files, timing the
// chapter plan in each episode's show notes against the published audio.
import type { APIContext } from 'astro';
import { chapters } from '../../../utils/podcast';

export function getStaticPaths() {
  return Object.keys(chapters).map((slug) => ({ params: { slug } }));
}

export function GET({ params }: APIContext) {
  return new Response(JSON.stringify(chapters[params.slug!]), {
    headers: { 'Content-Type': 'application/json+chapters' },
  });
}
