/**
 * Generates WebP images for catalog directions.
 * Run: node scripts/generate-direction-images.mjs
 */
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/catalog');
mkdirSync(outDir, { recursive: true });

const SLUGS = [
  { slug: 'metalloprokat', title: 'Металлопрокат', color: '#2a3a4a' },
  { slug: 'specialnye-stali', title: 'Специальные стали', color: '#3a2a4a' },
  { slug: 'metallokonstrukcii', title: 'Металлоконструкции', color: '#2a4a3a' },
  { slug: 'inzhenernye-sistemy', title: 'Инженерные системы', color: '#2a3a5a' },
  { slug: 'kanalizaciya', title: 'Канализация', color: '#3a4a2a' },
  { slug: 'tehnicheskaya-izolyaciya', title: 'Техническая изоляция', color: '#4a3a2a' },
  { slug: 'elektrotehnika', title: 'Электротехника', color: '#3a3a2a' },
  { slug: 'fasady-i-krovlya', title: 'Фасады и кровля', color: '#2a4a4a' },
  { slug: 'zashchita-ot-bpla', title: 'Защита от БПЛА', color: '#4a2a2a' },
  { slug: 'kompleksnaya-komplektaciya', title: 'Комплексная комплектация', color: '#14452F' },
];

const items = SLUGS;

function svg(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${item.color}"/>
        <stop offset="100%" stop-color="#14452F"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bg)"/>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="0.3" opacity="0.08"/>
    </pattern>
    <rect width="800" height="500" fill="url(#grid)"/>
    <rect x="40" y="340" width="720" height="120" fill="#14452F" opacity="0.9" rx="8"/>
    <text x="60" y="400" fill="white" font-family="Arial,sans-serif" font-size="32" font-weight="700">${item.title}</text>
    <text x="60" y="435" fill="#a8d4bc" font-family="Arial,sans-serif" font-size="16">DELDIN TRADE · Каталог</text>
    <circle cx="680" cy="180" r="80" fill="none" stroke="#c8cdd2" stroke-width="12" opacity="0.5"/>
    <rect x="600" y="120" width="160" height="120" fill="none" stroke="#c8cdd2" stroke-width="8" opacity="0.4" rx="4"/>
  </svg>`;
}

for (const item of items) {
  const path = join(outDir, `${item.slug}.webp`);
  const thumbPath = join(outDir, `${item.slug}-thumb.webp`);
  await sharp(Buffer.from(svg(item))).webp({ quality: 82 }).resize(800, 500).toFile(path);
  await sharp(Buffer.from(svg(item))).webp({ quality: 78 }).resize(400, 250).toFile(thumbPath);
  console.log('✓', item.slug);
}
