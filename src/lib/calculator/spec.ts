import type { SpecItem } from './types';

let counter = 0;

export function createSpecItem(
  profileName: string,
  metalName: string,
  dimensions: string,
  quantity: number,
  weightPerPiece: number,
  totalWeight: number,
  volume: number,
  surfaceArea: number,
  estimatedCost: number | null,
): SpecItem {
  return {
    id: `spec-${++counter}-${Date.now()}`,
    profileName,
    metalName,
    dimensions,
    quantity,
    weightPerPiece,
    totalWeight,
    volume,
    surfaceArea,
    estimatedCost,
  };
}

export function specTotals(items: SpecItem[]) {
  return {
    totalWeight: round(items.reduce((s, i) => s + i.totalWeight, 0), 3),
    totalVolume: round(items.reduce((s, i) => s + i.volume, 0), 6),
    totalSurface: round(items.reduce((s, i) => s + i.surfaceArea, 0), 3),
    totalCost: items.some((i) => i.estimatedCost !== null)
      ? round(items.reduce((s, i) => s + (i.estimatedCost ?? 0), 0), 2)
      : null,
    count: items.length,
  };
}

export function formatSpecText(items: SpecItem[]): string {
  const totals = specTotals(items);
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.profileName} · ${item.metalName} · ${item.dimensions} — ${item.quantity} шт, ${item.totalWeight} кг${item.estimatedCost ? `, ~${item.estimatedCost.toLocaleString('ru-RU')} ₽` : ''}`,
  );
  lines.push('');
  lines.push(`Итого: ${totals.totalWeight} кг${totals.totalCost ? `, ~${totals.totalCost.toLocaleString('ru-RU')} ₽` : ''}`);
  lines.push('DELDIN TRADE — deltrade.pages.dev');
  return lines.join('\n');
}

export function exportSpecPrintHTML(items: SpecItem[]): string {
  const totals = specTotals(items);
  const rows = items
    .map(
      (item, i) =>
        `<tr><td>${i + 1}</td><td>${item.profileName}</td><td>${item.metalName}</td><td>${item.dimensions}</td><td>${item.quantity}</td><td>${item.totalWeight}</td><td>${item.estimatedCost?.toLocaleString('ru-RU') ?? '—'}</td></tr>`,
    )
    .join('');
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><title>Спецификация DELDIN TRADE</title>
<style>body{font-family:sans-serif;padding:24px;color:#1a1a1a}h1{font-size:18px}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#f3f4f6}tfoot td{font-weight:bold}</style></head>
<body><h1>Спецификация металлопроката — DELDIN TRADE</h1>
<table><thead><tr><th>№</th><th>Сортамент</th><th>Марка</th><th>Размеры</th><th>Кол-во</th><th>Вес, кг</th><th>₽</th></tr></thead>
<tbody>${rows}</tbody><tfoot><tr><td colspan="5">Итого</td><td>${totals.totalWeight}</td><td>${totals.totalCost?.toLocaleString('ru-RU') ?? '—'}</td></tr></tfoot></table>
<p style="margin-top:16px;font-size:11px;color:#666">Расчёт теоретический. Не является публичной офертой.</p></body></html>`;
}

export function exportSpecCSV(items: SpecItem[]): string {
  const header = '№;Сортамент;Марка;Размеры;Кол-во;Вес 1 шт (кг);Общий вес (кг);Объём (м³);Площадь (м²);Стоимость (₽)';
  const rows = items.map((item, i) =>
    [
      i + 1,
      item.profileName,
      item.metalName,
      `"${item.dimensions}"`,
      item.quantity,
      item.weightPerPiece,
      item.totalWeight,
      item.volume,
      item.surfaceArea,
      item.estimatedCost ?? '',
    ].join(';'),
  );
  const totals = specTotals(items);
  rows.push('');
  rows.push(`ИТОГО;;;;;${totals.totalWeight};${totals.totalVolume};${totals.totalSurface};${totals.totalCost ?? ''}`);
  return [header, ...rows].join('\n');
}

function round(n: number, d: number) {
  return Math.round(n * 10 ** d) / 10 ** d;
}
