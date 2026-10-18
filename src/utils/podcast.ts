// Shared facts about the Manual Focus podcast, used by the feed, the hub page,
// structured data and llms.txt so they can't drift apart.

export const SHOW = {
  title: 'Manual Focus',
  subtitle: 'AI news for marketing leaders, talked through',
  description:
    'James Vickers and Hannah, the Manual Focus AI expert, talk through each article from the Manual Focus blog: what changed in AI and search, what it means for marketing teams, and the jobs you can hand to AI this month. Both voices are AI-generated from our own scripts.',
  author: 'James Vickers, Manual Focus',
  email: 'James@manual-focus.co.uk',
  image: '/images/podcast-cover.jpg',
  category: 'Business',
  subcategory: 'Marketing',
  feed: '/podcast.xml',
  hub: '/podcast/',
  // Podcasting 2.0 GUID: UUIDv5 of "manual-focus.co.uk/podcast.xml" in the
  // podcast namespace. It must never change, even if the feed URL does.
  guid: 'c2f6e872-94ad-5d8d-80f7-3b966158e436',
  // Directory listings. Fill in once each one is live; links render only
  // when set.
  apple: 'https://podcasts.apple.com/gb/podcast/manual-focus/id6824067738',
  spotify: 'https://open.spotify.com/show/0bc23K2CrBxO4nnSFyYi9f',
};

export interface Turn {
  speaker: 'James' | 'Hannah';
  text: string;
}

const scripts = import.meta.glob<string>('/podcast/scripts/*.txt', { eager: true, query: '?raw', import: 'default' });

// The episode transcript, read from the script it was voiced from. The
// ElevenLabs delivery tags ([dryly], [pause] and so on) are performance
// directions, not words, so they're removed.
export function transcript(slug: string): Turn[] | undefined {
  const raw = scripts[`/podcast/scripts/${slug}.txt`];
  if (!raw) return undefined;
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim().match(/^(JAMES|HANNAH):\s*([\s\S]+)$/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => ({
      speaker: m[1] === 'JAMES' ? 'James' : 'Hannah',
      text: m[2].replace(/\[[a-z ]+\]\s*/gi, '').replace(/\s+/g, ' ').trim(),
    }));
}

// Chapters files written by podcast/chapters.mjs, keyed by post slug.
export const chapters = Object.fromEntries(
  Object.entries(import.meta.glob<object>('/podcast/chapters/*.json', { eager: true, import: 'default' }))
    .map(([path, file]) => [path.replace(/^.*\/|\.json$/g, ''), file]),
);

export const transcriptText = (turns: Turn[]) => turns.map((t) => `${t.speaker}: ${t.text}`).join('\n\n');

// ISO 8601 duration for schema.org, e.g. 490 seconds -> PT8M10S.
export const isoDuration = (seconds: number) => `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;
