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
