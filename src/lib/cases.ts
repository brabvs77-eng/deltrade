import cases from '../data/cases.json';

export interface CaseStat {
  label: string;
  value: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  region: string;
  industry: string;
  duration: string;
  intro?: string;
  context?: string;
  task: string;
  solution: string;
  steps?: string[];
  items: string[];
  stats?: CaseStat[];
  result: string;
  image?: string;
}

export function getAllCases(): CaseStudy[] {
  return cases as CaseStudy[];
}

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return getAllCases().find((c) => c.slug === slug);
}
