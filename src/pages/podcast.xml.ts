// The Manual Focus podcast feed, for Apple Podcasts, Spotify and any other
// podcast app. One episode per blog post that has a `podcast` block in its
// frontmatter (written by podcast/publish-episode.mjs). Episode notes come
// from the summary in podcast/notes/<slug>.md.
import { getCollection, type CollectionEntry } from 'astro:content';
import { SHOW, transcript } from '../utils/podcast';
import type { APIContext } from 'astro';


const notes = import.meta.glob<string>('/podcast/notes/*.md', { eager: true, query: '?raw', import: 'default' });

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The episode summary: the notes' first paragraph after the frontmatter.
function summary(slug: string, fallback: string) {
  const raw = notes[`/podcast/notes/${slug}.md`];
  if (!raw) return fallback;
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  return body.split(/\n\s*\n/)[0].replace(/\s+/g, ' ');
}

const hms = (seconds: number) =>
  [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');

type Post = CollectionEntry<'blog'>;
const episodeDate = (post: Post) => post.data.podcast?.published ?? post.data.date;

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const episodes = (await getCollection('blog'))
    .filter((post) => post.data.podcast)
    .sort((a, b) =>
      episodeDate(b).getTime() - episodeDate(a).getTime() ||
      b.data.date.getTime() - a.data.date.getTime());

  const items = episodes.map((post) => {
    const { audio, duration, bytes } = post.data.podcast!;
    const published = episodeDate(post);
    const link = `${site}/blog/${post.id}/`;
    const text = summary(post.id, post.data.description);
    const html = `<p>${escape(text)}</p><p>Read the article and get the prompts: <a href="${link}">${escape(post.data.title)}</a></p>`;
    return `
    <item>
      <title>${escape(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">manual-focus-podcast-${post.id}</guid>
      <pubDate>${published.toUTCString()}</pubDate>
      <description><![CDATA[${html}]]></description>
      <itunes:summary>${escape(text)}</itunes:summary>
      <enclosure url="${escape(audio)}" length="${bytes}" type="audio/mpeg" />
      ${transcript(post.id) ? `<podcast:transcript url="${site}/podcast/transcripts/${post.id}.txt" type="text/plain" language="en-gb" />
      ` : ''}<itunes:duration>${hms(duration)}</itunes:duration>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${escape(SHOW.title)}</title>
    <link>${site}${SHOW.hub}</link>
    <atom:link href="${site}/podcast.xml" rel="self" type="application/rss+xml" />
    <language>en-gb</language>
    <copyright>© ${new Date().getFullYear()} Manual Focus</copyright>
    <description>${escape(SHOW.description)}</description>
    <itunes:subtitle>${escape(SHOW.subtitle)}</itunes:subtitle>
    <itunes:summary>${escape(SHOW.description)}</itunes:summary>
    <itunes:author>${escape(SHOW.author)}</itunes:author>
    <itunes:owner>
      <itunes:name>${escape(SHOW.author)}</itunes:name>
      <itunes:email>${SHOW.email}</itunes:email>
    </itunes:owner>
    <itunes:image href="${site}${SHOW.image}" />
    <image>
      <url>${site}${SHOW.image}</url>
      <title>${escape(SHOW.title)}</title>
      <link>${site}/blog/</link>
    </image>
    <itunes:category text="${SHOW.category}">
      <itunes:category text="${SHOW.subcategory}" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <podcast:guid>${SHOW.guid}</podcast:guid>
    <podcast:locked owner="${SHOW.email}">yes</podcast:locked>
    <podcast:medium>podcast</podcast:medium>
    <podcast:person role="host" href="${site}/about/" img="${site}/images/james-vickers.jpg">James Vickers</podcast:person>
    <podcast:person role="host">Hannah</podcast:person>${items.join('')}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
