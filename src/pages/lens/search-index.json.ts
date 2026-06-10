import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Build-time search index for the command palette and the library
// filter. Emitted as a static JSON file at /lens/search-index.json.
// Keep entries lean — this ships to the client on first palette open.

const STACK_NAMES: Record<string, string> = {
  brand: 'Brand',
  demand: 'Demand',
  content: 'Content',
  ops: 'Ops',
  productivity: 'Productivity',
};

export const GET: APIRoute = async () => {
  const playbooks = await getCollection('lens');
  const skills = await getCollection('lensSkills');

  const playbookEntries = playbooks.map((entry) => {
    const slug = entry.id.split('/').pop()?.replace(/\.md$/, '') ?? entry.id;
    return {
      type: 'playbook',
      title: entry.data.title,
      desc: entry.data.description,
      url: `/lens/${entry.data.stack}/${slug}/`,
      stack: STACK_NAMES[entry.data.stack] ?? entry.data.stack,
      meta: `${entry.data.shipTime} · ${entry.data.readMin} min`,
    };
  });

  const skillEntries = skills.map((s) => ({
    type: 'skill',
    title: s.data.name,
    desc: s.data.description.slice(0, 140),
    url: `/lens/skills/${s.data.name}/`,
    stack: 'Skill',
    meta: 'runnable',
  }));

  const pageEntries = [
    { title: 'The Lens', desc: 'Your AI marketing team. The hub.', url: '/lens/' },
    { title: 'Start here', desc: 'Orientation. Which playbook to run first.', url: '/lens/start-here/' },
    { title: 'Library', desc: 'All 46 playbooks, searchable.', url: '/lens/library/' },
    { title: 'Skills', desc: 'The 26 installable Claude Code skills.', url: '/lens/skills/' },
    { title: 'Prompting 101', desc: 'What a prompt is, what a skill is, plainly.', url: '/lens/primer/' },
    { title: 'Cowork primer', desc: 'Wire Claude into your real tools.', url: '/lens/cowork/' },
    { title: 'Capability reference', desc: 'What AI can and cannot reliably do this quarter.', url: '/lens/capabilities/' },
    { title: 'Services', desc: 'How Manual Focus works with brands.', url: '/services/' },
    { title: 'About', desc: 'Who is behind Manual Focus.', url: '/about/' },
    { title: 'Blog', desc: 'Perspective on AI-era marketing.', url: '/blog/' },
    { title: 'Enquire', desc: 'Book a working session.', url: '/enquire/' },
  ].map((p) => ({ type: 'page', stack: 'Page', meta: '', ...p }));

  const index = [...playbookEntries, ...skillEntries, ...pageEntries];

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
