import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ALLOWED_TAGS = [
  'ai',
  'marketing-strategy',
  'fractional-cmo',
  'digital-transformation',
  'brand',
  'go-to-market',
  'web3',
  'fintech',
  'endurance-sports',
  'leadership',
  'productivity',
] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.enum(ALLOWED_TAGS)).min(1),
    description: z.string().max(160),
    image: z.string().optional(),
    // Optional HowTo schema steps for step-by-step articles. When set,
    // SEOHead emits HowTo structured data for rich-result eligibility.
    howToName: z.string().optional(),
    howToSteps: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    order: z.number(),
  }),
});

// The Lens — the library of AI marketing playbooks. Each entry is a real
// workflow run by Manual Focus partners on client work, structured as the
// six artefacts the marketing page promises (brief, pipeline, prompts,
// eval harness, failure modes, receipts) and stored as one markdown file
// per playbook under src/content/lens/<stack>/<slug>.md.
const LENS_STACKS = ['brand', 'demand', 'content', 'ops', 'productivity'] as const;
const LENS_MODELS = [
  'gpt-5',
  'gpt-4.1',
  'claude-4.5-opus',
  'claude-4.5-sonnet',
  'claude-3.7',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'llama-3.3',
  'mistral-large',
  'deepseek-v3',
] as const;
const LENS_STATUS = ['live', 'updated', 'beta', 'retired'] as const;
const LENS_BRAND_STAGE = ['pre-launch', 'launch', 'growth', 'scale', 'enterprise'] as const;
const LENS_CHANNELS = [
  'seo',
  'paid-search',
  'paid-social',
  'organic-social',
  'email',
  'lifecycle',
  'pr',
  'content',
  'video',
  'web',
  'product-marketing',
  'analytics',
  'brand',
  // Productivity / back-office channels
  'inbox',
  'calendar',
  'crm',
  'meetings',
  'docs',
  'tasks',
] as const;

const lens = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lens' }),
  schema: z.object({
    title: z.string(),
    stack: z.enum(LENS_STACKS),
    description: z.string().max(180),
    // What the workflow produces in plain English, one short noun phrase.
    outputs: z.string(),
    // Approximate read time for the playbook page itself.
    readMin: z.number().int().min(2).max(40),
    // Approximate ship time once a member has wired it up.
    shipTime: z.string(), // e.g. "1 working day", "2 weeks"
    // Filters surfaced in library UI.
    brandStage: z.array(z.enum(LENS_BRAND_STAGE)).min(1),
    channels: z.array(z.enum(LENS_CHANNELS)).default([]),
    models: z.array(z.enum(LENS_MODELS)).min(1),
    // Lifecycle.
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(LENS_STATUS).default('live'),
    // Free preview — readable without subscription. Use sparingly to seed
    // credibility on the public marketing page.
    preview: z.boolean().default(false),
  }),
});

// The Lens — Skills. Executable companion to the playbooks. Source-of-truth
// lives at /lens-skills (alongside the .claude-plugin manifest so it's
// installable as a Claude Code plugin). Astro loads them from there.
const lensSkills = defineCollection({
  loader: glob({ pattern: '*/SKILL.md', base: './lens-skills' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    metadata: z.object({
      version: z.string(),
      playbook: z.string().url().optional(),
    }),
  }),
});

export const collections = { blog, faq, lens, lensSkills };
