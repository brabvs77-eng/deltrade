import cases from '../data/cases.json';

export interface CaseStudy {
  slug: string;
  title: string;
  region: string;
  industry: string;
  duration: string;
  task: string;
  solution: string;
  items: string[];
  result: string;
  image?: string;
}

export function getAllCases(): CaseStudy[] {
  return cases as CaseStudy[];
}

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return getAllCases().find((c) => c.slug === slug);
}
