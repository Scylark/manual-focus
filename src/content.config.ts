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

export const collections = { blog, faq };
