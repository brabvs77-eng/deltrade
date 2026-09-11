import type { MetaDescriptor } from 'astro:schema';
import { SITE } from '../constants';

export interface PageMeta {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

export function buildMeta({
  title,
  description = SITE.description,
  path = '',
  image = '/images/og-default.jpg',
  noindex = false,
}: PageMeta = {}): MetaDescriptor[] {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const canonical = new URL(path, SITE.url).href;
  const imageUrl = new URL(image, SITE.url).href;

  return [
    { title: pageTitle },
    { name: 'description', content: description },
    { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' },
    { rel: 'canonical', href: canonical },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: imageUrl },
    { property: 'og:locale', content: 'ru_RU' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ];
}
