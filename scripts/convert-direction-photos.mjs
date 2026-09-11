/**
 * Converts source photos (PNG/JPG) to catalog direction WebP + thumb.
 * Place sources in scripts/direction-photos/{slug}.png
 * Run: node scripts/convert-direction-photos.mjs
 */
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'scripts/direction-photos');
const outDir = join(root, 'public/images/catalog');

const SLUGS = [
  'metalloprokat',
  'specialnye-stali',
  'metallokonstrukcii',
  'inzhenernye-sistemy',
  'kanalizaciya',
  'tehnicheskaya-izolyaciya',
  'elektrotehnika',
  'fasady-i-krovlya',
  'zashchita-ot-bpla',
  'kompleksnaya-komplektaciya',
];

mkdirSync(outDir, { recursive: true });

for (const slug of SLUGS) {
  const src = [join(srcDir, `${slug}.png`), join(srcDir, `${slug}.jpg`), join(srcDir, `${slug}.webp`)].find(
    (p) => existsSync(p),
  );
  if (!src) {
    console.error('✗ missing source:', slug);
    process.exitCode = 1;
    continue;
  }
  const full = join(outDir, `${slug}.webp`);
  const thumb = join(outDir, `${slug}-thumb.webp`);
  await sharp(src).resize(800, 500, { fit: 'cover', position: 'centre' }).webp({ quality: 82 }).toFile(full);
  await sharp(src).resize(400, 250, { fit: 'cover', position: 'centre' }).webp({ quality: 78 }).toFile(thumb);
  console.log('✓', slug);
}
