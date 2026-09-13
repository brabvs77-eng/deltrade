#!/usr/bin/env node
/**
 * Converts generated blog hero art (scripts/blog-images/*.png) into the
 * webp variants the article and card layouts expect.
 *
 *   scripts/blog-images/<slug>.png
 *     -> public/images/blog/<slug>.webp        1200x675  (article hero, OG)
 *     -> public/images/blog/<slug>-thumb.webp   640x400  (list cards)
 */
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'scripts', 'blog-images');
const outDir = path.join(root, 'public', 'images', 'blog');

const VARIANTS = [
  { suffix: '', width: 1200, height: 675, quality: 82 },
  { suffix: '-thumb', width: 640, height: 400, quality: 78 },
];

await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir)).filter((f) =>
  /\.(png|jpe?g|webp)$/i.test(f)
);

if (files.length === 0) {
  console.error(`No source images found in ${srcDir}`);
  process.exit(1);
}

let converted = 0;

for (const file of files.sort()) {
  const slug = file.replace(/\.(png|jpe?g|webp)$/i, '');
  const input = path.join(srcDir, file);

  for (const variant of VARIANTS) {
    const output = path.join(outDir, `${slug}${variant.suffix}.webp`);
    await sharp(input)
      .resize(variant.width, variant.height, { fit: 'cover', position: 'centre' })
      .webp({ quality: variant.quality })
      .toFile(output);
  }

  converted += 1;
  console.log(`✓ ${slug}`);
}

console.log(`\nConverted ${converted} blog image(s) → public/images/blog/`);
