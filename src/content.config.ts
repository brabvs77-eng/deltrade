import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    h1: z.string().optional(),
    description: z.string(),
    category: z.enum([
      'truby',
      'detali-truboprovodov',
      'armatura',
      'listovye-zagotovki',
      'kanalizaciya-teplo',
      'profnastil',
      'komplektaciya',
    ]),
    number: z.number(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string(),
    imageAlt: z.string(),
    targetQuery: z.string(),
    targetRequest: z.string(),
    priority: z.boolean().default(false),
    related: z.array(z.string()).default([]),
    catalogLinks: z
      .array(z.object({ title: z.string(), href: z.string() }))
      .default([]),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
  }),
});

export const collections = { blog };
