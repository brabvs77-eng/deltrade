import services from '../data/services.json';

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  process: string;
}

export function getAllServices(): Service[] {
  return services as Service[];
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getAllServices().find((s) => s.slug === slug);
}
