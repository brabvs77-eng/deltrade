/**
 * Generates unique WebP product images (full + thumb) per catalog slug.
 * Run: node scripts/generate-product-images.mjs
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'public/images/products');
const products = JSON.parse(readFileSync(join(root, 'src/data/products.json'), 'utf8'));

mkdirSync(outDir, { recursive: true });

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function metalGrad(id, seed) {
  const hues = [
    ['#2a2f35', '#5a6570', '#8a95a0'],
    ['#1e2a24', '#3d5248', '#6b8578'],
    ['#252830', '#4a5058', '#7a828a'],
    ['#2c2620', '#5a4e42', '#8a7e72'],
    ['#1a2228', '#3a4a58', '#6a7a88'],
  ];
  const set = hues[seed % hues.length];
  return `
    <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${set[0]}"/>
      <stop offset="50%" stop-color="${set[1]}"/>
      <stop offset="100%" stop-color="${set[2]}"/>
    </linearGradient>
    <linearGradient id="metal-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c8cdd2"/>
      <stop offset="35%" stop-color="#eef1f4"/>
      <stop offset="55%" stop-color="#9aa3ab"/>
      <stop offset="100%" stop-color="#6d7680"/>
    </linearGradient>
    <linearGradient id="metal-dark-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#b0b8bf"/>
      <stop offset="100%" stop-color="#5a636b"/>
    </linearGradient>
  `;
}

function parseSize(title, slug, subsection) {
  const nums = slug.match(/\d+/g)?.map(Number) ?? [];
  if (subsection === 'armatura') return { d: nums[nums.length - 1] ?? 12 };
  if (subsection === 'list') return { t: nums[0] ?? 3 };
  if (subsection === 'krug') return { d: nums[0] ?? 20 };
  if (subsection === 'shestigrannik') return { d: nums[0] ?? 19 };
  if (subsection === 'polosa') return { a: nums[0] ?? 4, b: nums[1] ?? 40 };
  if (subsection === 'shveller' || subsection === 'dvutavr') return { n: nums[0] ?? 12 };
  if (subsection === 'ugolok') return { a: nums[0] ?? 50, b: nums[1] ?? 50, t: nums[2] ?? 5 };
  if (subsection === 'truba-profilnaya') return { a: nums[0] ?? 60, b: nums[1] ?? 60, t: nums[2] ?? 3 };
  if (subsection === 'truba-kruglaya') {
    const m = title.match(/(\d+)[×x](\d+(?:[.,]\d+)?)/);
    if (m) return { od: Number(m[1]), wall: Number(m[2].replace(',', '.')) };
    return { od: nums[0] ?? 57, wall: nums[1] ?? 3.5 };
  }
  return {};
}

function profileSvg(subsection, size, cx, cy, scale) {
  const g = (inner) => `<g transform="translate(${cx},${cy}) scale(${scale})">${inner}</g>`;
  const m = 'fill="url(#metal-' + 'ID' + ')" stroke="#4a5560" stroke-width="0.8"';

  switch (subsection) {
    case 'armatura': {
      const r = Math.min(90, 18 + (size.d ?? 12) * 2.2);
      const ribs = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return `<line x1="${Math.cos(a) * (r - 6)}" y1="${Math.sin(a) * (r - 6)}" x2="${Math.cos(a) * (r + 2)}" y2="${Math.sin(a) * (r + 2)}" stroke="#7a828a" stroke-width="2"/>`;
      }).join('');
      return g(`<circle r="${r}" ${m}/>${ribs}<circle r="${r * 0.35}" fill="#8a929a" opacity="0.5"/>`);
    }
    case 'krug': {
      const r = Math.min(95, 15 + (size.d ?? 20) * 2);
      return g(`<circle r="${r}" ${m}/><ellipse cx="${-r * 0.2}" cy="${-r * 0.25}" rx="${r * 0.35}" ry="${r * 0.2}" fill="white" opacity="0.25"/>`);
    }
    case 'list': {
      const t = Math.max(12, (size.t ?? 3) * 4);
      return g(`<rect x="-120" y="${-t / 2}" width="240" height="${t}" rx="1" ${m}/>
        <rect x="-120" y="${-t / 2 - 40}" width="240" height="40" fill="url(#metal-dark-ID)" opacity="0.7"/>`);
    }
    case 'polosa': {
      const w = Math.min(200, (size.b ?? 40) * 3.5);
      const h = Math.max(14, (size.a ?? 4) * 4);
      return g(`<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="1" ${m}/>`);
    }
    case 'ugolok': {
      const a = Math.min(120, (size.a ?? 50) * 1.6);
      const b = Math.min(120, (size.b ?? 50) * 1.6);
      const t = Math.max(8, (size.t ?? 5) * 2.5);
      return g(`<path d="M ${-a / 2} ${b / 2} L ${-a / 2} ${b / 2 - t} L ${-a / 2 + t} ${b / 2 - t} L ${-a / 2 + t} ${-b / 2 + t} L ${a / 2} ${-b / 2 + t} L ${a / 2} ${-b / 2} L ${-a / 2} ${-b / 2} Z" ${m}/>`);
    }
    case 'shveller': {
      const w = 100 + (size.n ?? 12) * 2;
      const h = 70 + (size.n ?? 12);
      const t = 10 + (size.n ?? 12) * 0.4;
      return g(`<path d="M ${-w / 2} ${-h / 2} L ${-w / 2} ${h / 2} L ${-w / 2 + t} ${h / 2} L ${-w / 2 + t} ${-h / 2 + t} L ${w / 2} ${-h / 2 + t} L ${w / 2} ${-h / 2} Z" ${m}/>`);
    }
    case 'dvutavr': {
      const w = 90 + (size.n ?? 20) * 2.5;
      const h = 110 + (size.n ?? 20) * 2;
      const tf = 12;
      const tw = 8;
      return g(`<path d="M ${-w / 2} ${-h / 2} L ${w / 2} ${-h / 2} L ${w / 2} ${-h / 2 + tf} L ${tw / 2} ${-h / 2 + tf} L ${tw / 2} ${h / 2 - tf} L ${w / 2} ${h / 2 - tf} L ${w / 2} ${h / 2} L ${-w / 2} ${h / 2} L ${-w / 2} ${h / 2 - tf} L ${-tw / 2} ${h / 2 - tf} L ${-tw / 2} ${-h / 2 + tf} L ${-w / 2} ${-h / 2 + tf} Z" ${m}/>`);
    }
    case 'truba-profilnaya': {
      const a = Math.min(130, (size.a ?? 60) * 1.4);
      const t = Math.max(8, (size.t ?? 3) * 2.5);
      return g(`<rect x="${-a / 2}" y="${-a / 2}" width="${a}" height="${a}" fill="none" stroke="url(#metal-ID)" stroke-width="${t}" rx="2"/>
        <rect x="${-a / 2 + t}" y="${-a / 2 + t}" width="${a - t * 2}" height="${a - t * 2}" fill="url(#metal-dark-ID)" opacity="0.3"/>`);
    }
    case 'truba-kruglaya': {
      const od = Math.min(150, (size.od ?? 57) * 1.6);
      const wall = Math.max(6, (size.wall ?? 3.5) * 2.2);
      return g(`<circle r="${od / 2}" fill="none" stroke="url(#metal-ID)" stroke-width="${wall}"/>
        <circle r="${od / 2 - wall}" fill="url(#metal-dark-ID)" opacity="0.25"/>`);
    }
    case 'shestigrannik': {
      const r = Math.min(95, 12 + (size.d ?? 19) * 2.2);
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        return `${Math.cos(a) * r},${Math.sin(a) * r}`;
      }).join(' ');
      return g(`<polygon points="${pts}" ${m}/>`);
    }
    default:
      return g(`<rect x="-80" y="-40" width="160" height="80" ${m}/>`);
  }
}

function buildSvg(product, w, h) {
  const id = product.slug.replace(/[^a-z0-9]/gi, '');
  const seed = hash(product.slug);
  const size = parseSize(product.title, product.slug, product.subsection);
  const angle = (seed % 24) - 12;
  const cx = w * (0.45 + (seed % 10) / 100);
  const cy = h * (0.48 + (seed % 7) / 100);
  const scale = 0.85 + (seed % 15) / 100;
  let profile = profileSvg(product.subsection, size, cx, cy, scale);
  profile = profile.replace(/#metal-ID/g, `#metal-${id}`).replace(/#metal-dark-ID/g, `#metal-dark-${id}`);

  const vignette = `<radialGradient id="v-${id}" cx="50%" cy="45%" r="65%">
    <stop offset="0%" stop-color="transparent"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
  </radialGradient>`;

  const gridOpacity = 0.04 + (seed % 5) * 0.01;
  const accent = ['#14452F', '#1a5c3f', '#0f3a28'][seed % 3];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      ${metalGrad(id, seed)}
      ${vignette}
      <pattern id="grid-${id}" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" stroke-width="0.5" opacity="${gridOpacity}"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
    <rect width="${w}" height="${h}" fill="url(#grid-${id})"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${profile}</g>
    <rect width="${w}" height="${h}" fill="url(#v-${id})"/>
    <rect x="0" y="${h - 56}" width="${w}" height="56" fill="${accent}" opacity="0.92"/>
    <text x="20" y="${h - 22}" fill="white" font-family="Arial, sans-serif" font-size="${w > 500 ? 18 : 13}" font-weight="600">${escapeXml(product.title)}</text>
    <text x="20" y="${h - 6}" fill="#a8d4bc" font-family="Arial, sans-serif" font-size="${w > 500 ? 11 : 9}">DELDIN TRADE · ${escapeXml(product.gost)}</text>
  </svg>`;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function renderProduct(product) {
  const fullSvg = buildSvg(product, 800, 600);
  const thumbSvg = buildSvg(product, 400, 300);
  const fullPath = join(outDir, `${product.slug}.webp`);
  const thumbPath = join(outDir, `${product.slug}-thumb.webp`);

  await sharp(Buffer.from(fullSvg)).webp({ quality: 82 }).toFile(fullPath);
  await sharp(Buffer.from(thumbSvg)).webp({ quality: 78 }).toFile(thumbPath);
  return product.slug;
}

console.log(`Generating ${products.length} product images...`);
for (const product of products) {
  const slug = await renderProduct(product);
  console.log(`  ✓ ${slug}`);
}
console.log('Done.');
