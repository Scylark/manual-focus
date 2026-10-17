// Shared facts about the Manual Focus podcast, used by the feed, the /podcast/
// page, the transcript on each post and the episode structured data.

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
  // podcast:guid, a UUIDv5 of "manual-focus.co.uk/podcast.xml" in the
  // Podcasting 2.0 namespace. It must never change.
  guid: 'c2f6e872-94ad-5d8d-80f7-3b966158e436',
  // Directory listings, once Apple and Spotify have approved the show. Empty
  // ones aren't shown or added to the structured data.
  listen: {
    apple: '',
    spotify: '',
  },
};

const SPEAKERS: Record<string, string> = { JAMES: 'James', HANNAH: 'Hannah' };

const scripts = import.meta.glob<string>('/podcast/scripts/*.txt', { eager: true, query: '?raw', import: 'default' });

export interface Turn { speaker: string; text: string }

// The episode's script as a transcript: one turn per speaker change, with the
// ElevenLabs audio tags ([dryly], [pause] ...) taken out.
export function transcript(slug: string): Turn[] {
  const raw = scripts[`/podcast/scripts/${slug}.txt`];
  if (!raw) return [];
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim().match(/^(JAMES|HANNAH):\s*([\s\S]+)$/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => ({
      speaker: SPEAKERS[m[1]],
      text: m[2].replace(/\[[^\]]*\]\s*/g, '').replace(/\s+/g, ' ').trim(),
    }))
    .filter((turn) => turn.text);
}

export const transcriptText = (turns: Turn[]) => turns.map((t) => `${t.speaker}: ${t.text}`).join('\n\n');

// ISO 8601 duration for structured data, e.g. PT7M15S.
export const isoDuration = (seconds: number) =>
  `PT${Math.floor(seconds / 60)}M${Math.round(seconds % 60)}S`;
