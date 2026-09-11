/**
 * Generates WebP images for case studies.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/cases');
mkdirSync(outDir, { recursive: true });

const cases = JSON.parse(readFileSync(join(root, 'src/data/cases.json'), 'utf8'));

for (const c of cases) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e2a24"/><stop offset="100%" stop-color="#14452F"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#g)"/>
    <rect x="0" y="500" width="1200" height="175" fill="#000" opacity="0.5"/>
    <text x="48" y="580" fill="white" font-family="Arial" font-size="28" font-weight="700">${c.title.slice(0, 50)}</text>
    <text x="48" y="620" fill="#a8d4bc" font-family="Arial" font-size="18">${c.region} · ${c.industry}</text>
    <rect x="900" y="80" width="250" height="180" fill="none" stroke="#8a95a0" stroke-width="6" opacity="0.6"/>
    <line x1="900" y1="260" x2="1150" y2="80" stroke="#8a95a0" stroke-width="4" opacity="0.4"/>
  </svg>`;
  const path = join(outDir, `${c.slug}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(path);
  console.log('✓', c.slug);
}

// update cases.json with image paths
const updated = cases.map((c) => ({ ...c, image: `/images/cases/${c.slug}.webp` }));
import { writeFileSync } from 'node:fs';
writeFileSync(join(root, 'src/data/cases.json'), JSON.stringify(updated, null, 2) + '\n');
