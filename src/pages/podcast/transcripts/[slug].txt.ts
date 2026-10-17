// Plain-text transcript for each episode, linked from the podcast feed with
// <podcast:transcript> so apps that show transcripts (and search engines that
// read them) get the episode's words.
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { transcript, transcriptText } from '../../../utils/podcast';

export async function getStaticPaths() {
  const posts = await getCollection('blog', (p) => Boolean(p.data.podcast));
  return posts
    .filter((p) => transcript(p.id))
    .map((p) => ({ params: { slug: p.id }, props: { title: p.data.title } }));
}

export function GET({ params, props }: APIContext) {
  const turns = transcript(params.slug!)!;
  const text = `${props.title}\nManual Focus podcast transcript\n\n${transcriptText(turns)}\n`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
