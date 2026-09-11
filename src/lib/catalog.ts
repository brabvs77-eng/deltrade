import products from '../data/products.json';
import sectionsContent from '../data/sections-content.json';
import { CATALOG_DIRECTIONS } from './constants';

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  slug: string;
  section: string;
  subsection: string;
  title: string;
  h1: string;
  gost: string;
  steelGrade: string;
  diameter: number | null;
  weightPerMeter: number;
  pricePerTon: number;
  pricePerUnit?: number | null;
  description: string;
  useCases: string[];
  faq?: ProductFaq[];
  relatedSlugs?: string[];
  calculatorPreset: {
    profileId: string;
    metalId: string;
    dimensions: Record<string, number>;
  };
}

export function getAllProducts(): Product[] {
  return products as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductsBySection(section: string): Product[] {
  return getAllProducts().filter((p) => p.section === section);
}

export function getProductsBySubsection(section: string, subsection: string): Product[] {
  return getAllProducts().filter((p) => p.section === section && p.subsection === subsection);
}

export function getSectionTitle(slug: string): string {
  return CATALOG_DIRECTIONS.find((d) => d.slug === slug)?.title ?? slug;
}

export function getSectionContent(section: string) {
  return (sectionsContent as Record<string, { intro: string; competitorNotes: string; subsections: { slug: string; title: string }[] }>)[section];
}

export const SUBSECTIONS: Record<string, { slug: string; title: string }[]> = {
  metalloprokat: [
    { slug: 'armatura', title: 'Арматура' },
    { slug: 'truba-profilnaya', title: 'Труба профильная' },
    { slug: 'truba-kruglaya', title: 'Труба круглая' },
    { slug: 'list', title: 'Лист стальной' },
    { slug: 'ugolok', title: 'Уголок' },
    { slug: 'shveller', title: 'Швеллер' },
    { slug: 'dvutavr', title: 'Двутавр' },
    { slug: 'krug', title: 'Круг' },
    { slug: 'polosa', title: 'Полоса' },
    { slug: 'shestigrannik', title: 'Шестигранник' },
  ],
  ...Object.fromEntries(
    Object.entries(sectionsContent as Record<string, { subsections: { slug: string; title: string }[] }>).map(
      ([key, val]) => [key, val.subsections],
    ),
  ),
};

export function getSubsectionTitle(section: string, subsection: string): string {
  return SUBSECTIONS[section]?.find((s) => s.slug === subsection)?.title ?? subsection;
}
