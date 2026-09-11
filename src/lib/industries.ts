import industries from '../data/industries.json';

export interface Industry {
  slug: string;
  title: string;
  description: string;
  icon: string;
  details?: string;
  products?: string[];
}

export function getAllIndustries(): Industry[] {
  return industries as Industry[];
}

export function getIndustryBySlug(slug: string): Industry | undefined {
  return getAllIndustries().find((i) => i.slug === slug);
}
