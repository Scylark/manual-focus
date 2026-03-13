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
    tags: z.array(z.enum(ALLOWED_TAGS)).min(1),
    description: z.string().max(160),
    image: z.string().optional(),
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
