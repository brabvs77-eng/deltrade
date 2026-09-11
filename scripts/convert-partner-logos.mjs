/**
 * Converts partner logo sources to WebP for the homepage.
 * Run: node scripts/convert-partner-logos.mjs
 */
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'scripts/partner-logos');
const outDir = join(root, 'public/images/partners');
mkdirSync(outDir, { recursive: true });

const PARTNERS = [
  { slug: 'nlmk', src: 'nlmk-raw.svg' },
  { slug: 'severstal', src: 'severstal-raw.svg' },
  { slug: 'mmk', src: 'mmk-raw.png' },
  { slug: 'tmk', src: 'tmk-raw.svg' },
  { slug: 'chtpz', src: 'chtpz-raw.png' },
  { slug: 'mechel', src: 'mechel-raw.svg' },
  { slug: 'dellin', src: 'dellin-raw.svg' },
  { slug: 'pek', src: 'pek-raw.svg' },
];

for (const { slug, src } of PARTNERS) {
  const path = join(srcDir, src);
  if (!existsSync(path)) {
    console.error('✗ missing', src);
    process.exitCode = 1;
    continue;
  }
  const out = join(outDir, `${slug}.webp`);
  await sharp(path)
    .resize(240, 80, { fit: 'inside', withoutEnlargement: false, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 })
    .toFile(out);
  console.log('✓', slug);
}
