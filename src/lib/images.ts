const SUBSECTION_IMAGES: Record<string, string> = {
  armatura: '/images/products/armatura.webp',
  'truba-profilnaya': '/images/products/truba-profilnaya.webp',
  'truba-kruglaya': '/images/products/truba-kruglaya.webp',
  list: '/images/products/list.webp',
  ugolok: '/images/products/ugolok.webp',
  shveller: '/images/products/shveller.webp',
  dvutavr: '/images/products/dvutavr.webp',
  krug: '/images/products/krug.webp',
  polosa: '/images/products/polosa.webp',
  shestigrannik: '/images/products/shestigrannik.webp',
};

const SERVICE_IMAGES: Record<string, string> = {
  metalloobrabotka: '/images/services/metalloobrabotka.webp',
  'izgotovlenie-po-chertezham': '/images/services/izgotovlenie-po-chertezham.webp',
  komplektaciya: '/images/services/komplektaciya.webp',
  logistika: '/images/services/logistika.webp',
};

export const HERO_BG = '/images/hero/hero-bg.webp';
export const OG_DEFAULT = '/images/og-default.webp';

export function getProductImage(subsection: string, thumb = false): string {
  const base = SUBSECTION_IMAGES[subsection] ?? '/images/products/armatura.webp';
  if (thumb) return base.replace('.webp', '-thumb.webp');
  return base;
}

export function getServiceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? '/images/services/komplektaciya.webp';
}

export function getProductImageAlt(title: string): string {
  return `${title} — металлопрокат DELDIN TRADE`;
}
