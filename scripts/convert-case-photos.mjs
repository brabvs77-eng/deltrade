/**
 * Converts source photos to case study WebP images.
 * Place sources in scripts/case-photos/{slug}.png
 * Run: node scripts/convert-case-photos.mjs
 */
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'scripts/case-photos');
const outDir = join(root, 'public/images/cases');
const casesPath = join(root, 'src/data/cases.json');

const cases = JSON.parse(readFileSync(casesPath, 'utf8'));
mkdirSync(outDir, { recursive: true });

for (const c of cases) {
  const src = [join(srcDir, `${c.slug}.png`), join(srcDir, `${c.slug}.jpg`)].find((p) => existsSync(p));
  if (!src) {
    console.error('✗ missing source:', c.slug);
    process.exitCode = 1;
    continue;
  }
  const out = join(outDir, `${c.slug}.webp`);
  await sharp(src).resize(1200, 675, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(out);
  c.image = `/images/cases/${c.slug}.webp`;
  console.log('✓', c.slug);
}

writeFileSync(casesPath, JSON.stringify(cases, null, 2) + '\n');
