/**
 * @deprecated Use photorealistic sources in scripts/direction-photos/ + convert-direction-photos.mjs
 * Legacy SVG generator kept for fallback. Prefer: node scripts/convert-direction-photos.mjs
 */
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/catalog');
mkdirSync(outDir, { recursive: true });

const BRAND = '#14452F';
const BRAND_LIGHT = '#1a5c3f';
const METAL = '#c8cdd2';
const METAL_DARK = '#6d7680';
const ACCENT = '#2d8a5e';

const DIRECTIONS = [
  {
    slug: 'metalloprokat',
    title: 'Металлопрокат',
    subtitle: 'Арматура · трубы · лист · балки',
    bg: ['#1a2228', '#2a3540', '#3d4f5c'],
    scene: (id) => `
      <g transform="translate(520,200)">
        <rect x="-90" y="-8" width="180" height="16" rx="2" fill="url(#metal-${id})" stroke="#4a5560" stroke-width="1"/>
        <rect x="-90" y="-48" width="180" height="40" fill="url(#metal-dark-${id})" opacity="0.85"/>
        <circle cx="-55" cy="55" r="28" fill="url(#metal-${id})" stroke="#4a5560"/>
        <circle cx="0" cy="55" r="22" fill="url(#metal-${id})" stroke="#4a5560"/>
        <circle cx="48" cy="55" r="18" fill="url(#metal-${id})" stroke="#4a5560"/>
        <rect x="55" y="-70" width="70" height="70" fill="none" stroke="url(#metal-${id})" stroke-width="10" rx="2"/>
        <path d="M -120 -90 L -120 30 L -100 30 L -100 -70 L 80 -70 L 80 -90 Z" fill="url(#metal-${id})" stroke="#4a5560" stroke-width="1"/>
      </g>`,
  },
  {
    slug: 'specialnye-stali',
    title: 'Специальные стали',
    subtitle: 'Инструментальные · легированные · нержавейка',
    bg: ['#1e1828', '#2d2440', '#3f3558'],
    scene: (id) => `
      <g transform="translate(530,210)">
        <polygon points="0,-95 82,-29 82,67 0,133 -82,67 -82,-29" fill="url(#metal-${id})" stroke="${ACCENT}" stroke-width="3"/>
        <polygon points="0,-60 50,-18 50,42 0,84 -50,42 -50,-18" fill="url(#metal-dark-${id})" opacity="0.6"/>
        <circle cx="0" cy="12" r="18" fill="${ACCENT}" opacity="0.9"/>
        <text x="0" y="18" text-anchor="middle" fill="white" font-size="14" font-weight="700">40Х</text>
        ${[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = (a * Math.PI) / 180;
          return `<line x1="${Math.cos(rad) * 70}" y1="${Math.sin(rad) * 70}" x2="${Math.cos(rad) * 100}" y2="${Math.sin(rad) * 100}" stroke="${ACCENT}" stroke-width="2" opacity="0.7"/>`;
        }).join('')}
      </g>`,
  },
  {
    slug: 'metallokonstrukcii',
    title: 'Металлоконструкции',
    subtitle: 'Фермы · каркасы · изготовление по чертежам',
    bg: ['#182420', '#243830', '#345048'],
    scene: (id) => `
      <g transform="translate(500,240)" stroke="url(#metal-${id})" stroke-width="6" fill="none" stroke-linecap="round">
        <line x1="-140" y1="60" x2="0" y2="-80"/>
        <line x1="140" y1="60" x2="0" y2="-80"/>
        <line x1="-140" y1="60" x2="140" y2="60"/>
        <line x1="-70" y1="60" x2="0" y2="-80"/>
        <line x1="70" y1="60" x2="0" y2="-80"/>
        <line x1="-140" y1="60" x2="70" y2="-10"/>
        <line x1="140" y1="60" x2="-70" y2="-10"/>
        <rect x="-150" y="58" width="300" height="8" fill="url(#metal-dark-${id})" stroke="none"/>
        <rect x="-8" y="-88" width="16" height="150" fill="url(#metal-${id})" stroke="none" opacity="0.5"/>
      </g>`,
  },
  {
    slug: 'inzhenernye-sistemy',
    title: 'Инженерные системы',
    subtitle: 'Трубы · арматура · фитинги',
    bg: ['#152030', '#1e3048', '#2a4560'],
    scene: (id) => `
      <g transform="translate(520,220)">
        <rect x="-120" y="-15" width="200" height="30" rx="15" fill="url(#metal-${id})" stroke="#4a5560"/>
        <rect x="60" y="-35" width="30" height="70" rx="4" fill="url(#metal-dark-${id})" stroke="#4a5560"/>
        <circle cx="75" cy="0" r="22" fill="none" stroke="url(#metal-${id})" stroke-width="8"/>
        <circle cx="-130" cy="0" r="18" fill="url(#metal-${id})" stroke="#4a5560"/>
        <path d="M -148 -25 L -148 25 L -165 25 L -165 -25 Z" fill="url(#metal-dark-${id})"/>
        <ellipse cx="0" cy="55" rx="35" ry="12" fill="${ACCENT}" opacity="0.35"/>
        <text x="0" y="60" text-anchor="middle" fill="${METAL}" font-size="11">DN80</text>
      </g>`,
  },
  {
    slug: 'kanalizaciya',
    title: 'Канализация',
    subtitle: 'Трубы · колодцы · дренаж',
    bg: ['#1a2420', '#253530', '#354840'],
    scene: (id) => `
      <g transform="translate(520,230)">
        <ellipse cx="0" cy="50" rx="70" ry="18" fill="#2a3530" stroke="#4a6055"/>
        <rect x="-55" y="-60" width="110" height="110" rx="4" fill="url(#metal-dark-${id})" stroke="#5a7065"/>
        <rect x="-40" y="-45" width="80" height="80" rx="2" fill="#1a2820"/>
        <circle cx="0" cy="5" r="28" fill="none" stroke="${METAL}" stroke-width="5"/>
        <rect x="-90" y="30" width="180" height="22" rx="11" fill="#3a5548" stroke="#5a7568"/>
        <ellipse cx="-100" cy="41" rx="14" ry="14" fill="#3a5548" stroke="#5a7568"/>
      </g>`,
  },
  {
    slug: 'tehnicheskaya-izolyaciya',
    title: 'Техническая изоляция',
    subtitle: 'Минеральная · полимерная · фольгированная',
    bg: ['#28221a', '#3a3228', '#4a4238'],
    scene: (id) => `
      <g transform="translate(520,220)">
        <rect x="-100" y="-20" width="200" height="40" rx="20" fill="#8a7060" stroke="#6a5848"/>
        <rect x="-108" y="-28" width="216" height="56" rx="28" fill="none" stroke="#c8a880" stroke-width="6" opacity="0.8"/>
        <rect x="-116" y="-36" width="232" height="72" rx="36" fill="none" stroke="#e8d8c0" stroke-width="4" opacity="0.5"/>
        <rect x="-70" y="-55" width="140" height="18" rx="4" fill="url(#foil-${id})" opacity="0.9"/>
        <text x="0" y="65" text-anchor="middle" fill="${METAL}" font-size="12" opacity="0.8">φ89 · 30 мм</text>
      </g>`,
  },
  {
    slug: 'elektrotehnika',
    title: 'Электротехника',
    subtitle: 'Кабель · шины · лотки',
    bg: ['#1a1e28', '#282e40', '#384058'],
    scene: (id) => `
      <g transform="translate(520,210)">
        <path d="M -100 40 Q -50 -60 0 20 T 100 -30" fill="none" stroke="#2a3040" stroke-width="28" stroke-linecap="round"/>
        <path d="M -100 40 Q -50 -60 0 20 T 100 -30" fill="none" stroke="url(#cable-${id})" stroke-width="18" stroke-linecap="round"/>
        <path d="M -30 -80 L 10 -20 L -5 -20 L 25 50 L -15 -10 L 0 -10 Z" fill="#f0c040" stroke="#c09020" stroke-width="2"/>
        <rect x="-120" y="55" width="240" height="28" rx="3" fill="url(#metal-${id})" stroke="#4a5560"/>
        <rect x="-110" y="62" width="220" height="14" fill="#2a3040"/>
      </g>`,
  },
  {
    slug: 'fasady-i-krovlya',
    title: 'Фасады и кровля',
    subtitle: 'Профнастил · металлочерепица · сайдинг',
    bg: ['#1a2828', '#284038', '#385850'],
    scene: (id) => `
      <g transform="translate(500,230)">
        <polygon points="-150,40 0,-90 150,40" fill="url(#metal-${id})" stroke="#4a5560" stroke-width="2"/>
        <g stroke="#5a6870" stroke-width="1" opacity="0.6">
          ${Array.from({ length: 8 }, (_, i) => {
            const y = -70 + i * 16;
            const x1 = -120 + i * 8;
            const x2 = 120 - i * 8;
            return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y + 30}"/>`;
          }).join('')}
        </g>
        <rect x="-130" y="40" width="260" height="50" fill="url(#metal-dark-${id})" stroke="#4a5560"/>
        ${Array.from({ length: 6 }, (_, i) => `<rect x="${-120 + i * 42}" y="48" width="36" height="34" fill="url(#metal-${id})" stroke="#4a5560" opacity="0.9"/>`).join('')}
      </g>`,
  },
  {
    slug: 'zashchita-ot-bpla',
    title: 'Защита от БПЛА',
    subtitle: 'Сетки · башни · мобильные укрытия',
    bg: ['#281a1a', '#382424', '#483030'],
    scene: (id) => `
      <g transform="translate(520,220)">
        <rect x="-100" y="-30" width="200" height="60" fill="none" stroke="url(#metal-${id})" stroke-width="3"/>
        ${Array.from({ length: 11 }, (_, i) => `<line x1="${-100 + i * 20}" y1="-30" x2="${-100 + i * 20}" y2="30" stroke="url(#metal-${id})" stroke-width="1.5" opacity="0.7"/>`).join('')}
        ${Array.from({ length: 7 }, (_, i) => `<line x1="-100" y1="${-30 + i * 10}" x2="100" y2="${-30 + i * 10}" stroke="url(#metal-${id})" stroke-width="1.5" opacity="0.7"/>`).join('')}
        <ellipse cx="0" cy="-70" rx="35" ry="12" fill="url(#metal-dark-${id})" stroke="#4a5560"/>
        <line x1="0" y1="-58" x2="0" y2="-30" stroke="#4a5560" stroke-width="4"/>
        <path d="M -25 -95 L 0 -115 L 25 -95 L 15 -95 L 15 -75 L -15 -75 L -15 -95 Z" fill="#4a5560" opacity="0.8"/>
        <circle cx="60" cy="-80" r="8" fill="${ACCENT}" opacity="0.9"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/></circle>
      </g>`,
  },
  {
    slug: 'kompleksnaya-komplektaciya',
    title: 'Комплексная комплектация',
    subtitle: 'Многопозиционные заявки в одном проекте',
    bg: ['#142820', '#1e3830', '#284840'],
    scene: (id) => `
      <g transform="translate(510,220)">
        ${[
          [-70, -50, 55, 45],
          [10, -60, 50, 50],
          [-40, 10, 60, 48],
          [35, 5, 52, 52],
        ].map(([x, y, w, h], i) => `
          <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#metal-${id})" stroke="#4a5560" opacity="${0.7 + i * 0.08}"/>
          <line x1="${x + 8}" y1="${y + 14}" x2="${x + w - 8}" y2="${y + 14}" stroke="#4a5560" stroke-width="2" opacity="0.5"/>
          <line x1="${x + 8}" y1="${y + 24}" x2="${x + w - 20}" y2="${y + 24}" stroke="#4a5560" stroke-width="2" opacity="0.4"/>
        `).join('')}
        <circle cx="95" cy="-55" r="28" fill="${ACCENT}" opacity="0.9"/>
        <path d="M 82 -55 L 90 -47 L 110 -67" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="0" y="85" text-anchor="middle" fill="${METAL}" font-size="13" font-weight="600">1 заявка · 1 договор</text>
      </g>`,
  },
];

function defs(id, bg) {
  return `
    <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg[0]}"/>
      <stop offset="55%" stop-color="${bg[1]}"/>
      <stop offset="100%" stop-color="${bg[2]}"/>
    </linearGradient>
    <linearGradient id="metal-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8dde2"/>
      <stop offset="40%" stop-color="#eef1f4"/>
      <stop offset="70%" stop-color="#9aa3ab"/>
      <stop offset="100%" stop-color="#6d7680"/>
    </linearGradient>
    <linearGradient id="metal-dark-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#a8b0b8"/>
      <stop offset="100%" stop-color="#5a636b"/>
    </linearGradient>
    <linearGradient id="foil-${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c0a070"/>
      <stop offset="50%" stop-color="#f0e0c0"/>
      <stop offset="100%" stop-color="#a08050"/>
    </linearGradient>
    <linearGradient id="cable-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a3040"/>
      <stop offset="30%" stop-color="#1a2030"/>
      <stop offset="70%" stop-color="#3a4050"/>
      <stop offset="100%" stop-color="#1a2030"/>
    </linearGradient>
    <pattern id="grid-${id}" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" stroke-width="0.4" opacity="0.06"/>
    </pattern>
    <pattern id="diamond-${id}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="8" height="8" fill="white" opacity="0.03"/>
    </pattern>
  `;
}

function svg(item, index) {
  const id = `d${index}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>${defs(id, item.bg)}</defs>
    <rect width="800" height="500" fill="url(#bg-${id})"/>
    <rect width="800" height="500" fill="url(#grid-${id})"/>
    <rect width="800" height="500" fill="url(#diamond-${id})"/>
    <rect x="0" y="380" width="800" height="120" fill="${BRAND}" opacity="0.92"/>
    <rect x="0" y="376" width="800" height="4" fill="${ACCENT}" opacity="0.8"/>
    ${item.scene(id)}
    <text x="48" y="430" fill="white" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="700">${item.title}</text>
    <text x="48" y="462" fill="#a8d4bc" font-family="Arial,Helvetica,sans-serif" font-size="15">${item.subtitle}</text>
    <text x="48" y="488" fill="${METAL_DARK}" font-family="Arial,Helvetica,sans-serif" font-size="12" opacity="0.9">DELDIN TRADE</text>
    <circle cx="48" cy="404" r="6" fill="${ACCENT}"/>
  </svg>`;
}

for (let i = 0; i < DIRECTIONS.length; i++) {
  const item = DIRECTIONS[i];
  const buf = Buffer.from(svg(item, i));
  const path = join(outDir, `${item.slug}.webp`);
  const thumbPath = join(outDir, `${item.slug}-thumb.webp`);
  await sharp(buf).webp({ quality: 85 }).resize(800, 500).toFile(path);
  await sharp(buf).webp({ quality: 80 }).resize(400, 250).toFile(thumbPath);
  console.log('✓', item.slug);
}

console.log(`\nGenerated ${DIRECTIONS.length} unique direction images.`);
