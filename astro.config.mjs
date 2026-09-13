// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { rehypeWrapTables } from './src/lib/rehype-wrap-tables.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://deltrade.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },
  compressHTML: true,
});
