// /llms.txt: a plain-text map of the site for AI assistants and answer
// engines (https://llmstxt.org). Generated at build time from the content
// collections so it never drifts from the pages it describes.
import { isListed } from '../utils/blog';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SHOW, transcript } from '../utils/podcast';

const STACKS: Record<string, string> = {
  brand: 'Brand & positioning',
  demand: 'Demand & growth',
  content: 'Content & channels',
  ops: 'Operating systems',
  productivity: 'Productivity & back office',
};

export async function GET(context: APIContext) {
  const site = context.site!.toString().replace(/\/$/, '');
  const playbooks = await getCollection('lens', (e) => e.data.status !== 'retired');
  const skills = await getCollection('lensSkills');
  const posts = (await getCollection('blog', isListed)).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const slugOf = (id: string) => id.split('/').pop()!.replace(/\.md$/, '');

  const lines: string[] = [
    '# Manual Focus',
    '',
    '> Manual Focus is a London marketing agency for endurance and sports brands, run by senior operators who also work in AI, fintech, hardware and digital assets. James Vickers leads it, and he was on the founding team at RGT Cycling, which Wahoo Fitness bought. The team works as a fractional CMO, as a strategic advisor or on fixed-price builds, with AI doing the heavy lifting. Manual Focus also publishes The Lens, a free library of AI marketing playbooks and installable Claude skills, and runs Light Meter, which measures which brands AI engines recommend and which sites they cite.',
    '',
    '## Working with Manual Focus',
    '',
    `- [Services](${site}/services/): Strategic Advisor, Fractional CMO, Build & Hand Over, and Manual Focus AI (done-for-you AI workflows)`,
    `- [About](${site}/about/): James Vickers and the Foundry collective`,
    `- [FAQ](${site}/faq/): how engagements work`,
    `- [Book a free working session](${site}/enquire/)`,
    '',
    '## The Lens (free AI marketing playbooks)',
    '',
    `- [The Lens](${site}/lens/): overview`,
    `- [Start here](${site}/lens/start-here/): where to begin`,
    `- [Capability reference](${site}/lens/capabilities/): what AI can reliably do for marketing this quarter`,
    `- [Library](${site}/lens/library/): all ${playbooks.length} playbooks`,
    '',
  ];
  for (const [stack, name] of Object.entries(STACKS)) {
    const inStack = playbooks.filter((p) => p.data.stack === stack).sort((a, b) => a.data.title.localeCompare(b.data.title));
    if (!inStack.length) continue;
    lines.push(`### ${name}`, '');
    for (const p of inStack) lines.push(`- [${p.data.title}](${site}/lens/${stack}/${slugOf(p.id)}/): ${p.data.description}`);
    lines.push('');
  }
  lines.push(
    '## Claude skills',
    '',
    `${skills.length} skills, installable in Cowork (Customize > Plugins > Add marketplace: Scylark/manual-focus) or Claude Code (/plugin marketplace add Scylark/manual-focus, then /plugin install the-lens@manual-focus).`,
    '',
    ...skills.sort((a, b) => a.data.name.localeCompare(b.data.name)).map((s) => `- [${s.data.name}](${site}/lens/skills/${s.data.name}/)`),
    '',
    '## Podcast',
    '',
    `${SHOW.description}`,
    '',
    `- [Podcast home](${site}${SHOW.hub}): every episode, and where to subscribe`,
    `- [Podcast feed](${site}${SHOW.feed})`,
    ...posts
      .filter((p) => p.data.podcast)
      .map((p) => `- [${p.data.title}](${site}/blog/${p.id}/#podcast)${transcript(p.id) ? `: [transcript](${site}/blog/${p.id}/#transcript)` : ''}`),
    '',
    '## Blog',
    '',
    `- [RSS feed](${site}/rss.xml)`,
    ...posts.map((p) => `- [${p.data.title}](${site}/blog/${p.id}/): ${p.data.description}`),
    '',
  );
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
