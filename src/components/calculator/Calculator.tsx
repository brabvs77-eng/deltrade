import { useCallback, useMemo, useState } from 'react';
import type { CalcMode, Metal, Profile, SpecItem } from '../../lib/calculator/types';
import { calculate } from '../../lib/calculator/calculate';
import { createSpecItem, exportSpecCSV, specTotals } from '../../lib/calculator/spec';
import metals from '../../data/metals.json';
import profiles from '../../data/profiles.json';
import prices from '../../data/prices.json';

const METAL_GROUPS: Record<string, string> = {
  construction: 'Конструкционные стали',
  tool: 'Инструментальные стали',
  stainless: 'Нержавеющие стали',
  nonferrous: 'Цветные металлы',
  custom: 'Другое',
};

function formatDims(profile: Profile, dims: Record<string, number>): string {
  return profile.fields
    .map((f) => `${f.label.split(' ')[0]} ${dims[f.key]}${f.unit}`)
    .join(' × ');
}

export default function Calculator() {
  const [profileId, setProfileId] = useState('rebar');
  const [metalId, setMetalId] = useState('a3');
  const [customDensity, setCustomDensity] = useState(7.85);
  const [quantity, setQuantity] = useState(1);
  const [pricePerKg, setPricePerKg] = useState<number | ''>('');
  const [mode, setMode] = useState<CalcMode>('weight');
  const [spec, setSpec] = useState<SpecItem[]>([]);
  const [dims, setDims] = useState<Record<string, number>>({});

  const profile = profiles.find((p) => p.id === profileId)! as Profile;
  const metal = metals.find((m) => m.id === metalId)! as Metal;

  const dimensions = useMemo(() => {
    const d: Record<string, number> = {};
    for (const f of profile.fields) {
      d[f.key] = dims[f.key] ?? f.default;
    }
    return d;
  }, [profile, dims]);

  const defaultPrice = (prices as Record<string, number>)[metalId] ?? 55;

  const result = useMemo(
    () =>
      calculate(
        {
          profileId,
          metalId,
          customDensity,
          dimensions,
          quantity,
          pricePerKg: pricePerKg === '' ? defaultPrice : pricePerKg,
          mode,
        },
        profile,
        metal,
      ),
    [profileId, metalId, customDensity, dimensions, quantity, pricePerKg, defaultPrice, mode, profile, metal],
  );

  const setDim = useCallback((key: string, value: number) => {
    setDims((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleProfileChange = (id: string) => {
    setProfileId(id);
    setDims({});
  };

  const handleMetalChange = (id: string) => {
    setMetalId(id);
    const p = (prices as Record<string, number>)[id];
    if (p) setPricePerKg(p);
  };

  const addToSpec = () => {
    if (!result.isValid) return;
    const item = createSpecItem(
      profile.name,
      metal.name,
      formatDims(profile, dimensions),
      result.quantity,
      result.weightPerPiece,
      result.totalWeight,
      result.volume,
      result.surfaceArea,
      result.estimatedCost,
    );
    setSpec((prev) => [...prev, item]);
  };

  const removeFromSpec = (id: string) => {
    setSpec((prev) => prev.filter((i) => i.id !== id));
  };

  const downloadCSV = () => {
    const csv = exportSpecCSV(spec);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'specifikaciya-deldin-trade.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totals = specTotals(spec);

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-steel-300 bg-surface text-steel-900 text-base min-h-[44px] focus:outline-2 focus:outline-brand focus:border-brand';

  return (
    <div className="space-y-6">
      {/* Profile selector */}
      <div>
        <label className="block text-sm font-semibold text-steel-700 mb-2">Сортамент</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {(profiles as Profile[]).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleProfileChange(p.id)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-center transition-all min-h-[64px] ${
                profileId === p.id
                  ? 'border-brand bg-brand/5 text-brand font-semibold shadow-sm'
                  : 'border-steel-300 bg-white text-steel-600 hover:border-steel-400'
              }`}
            >
              <span className="text-lg" aria-hidden="true">{p.icon}</span>
              <span className="text-[11px] sm:text-xs leading-tight">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metal + dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-steel-700 mb-1.5">Марка металла</label>
            <select
              value={metalId}
              onChange={(e) => handleMetalChange(e.target.value)}
              className={inputClass}
            >
              {Object.entries(METAL_GROUPS).map(([group, label]) => {
                const groupMetals = (metals as Metal[]).filter((m) => m.group === group);
                if (!groupMetals.length) return null;
                return (
                  <optgroup key={group} label={label}>
                    {groupMetals.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (ρ {m.density} г/см³)
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {metalId === 'custom' && (
            <div>
              <label className="block text-sm font-semibold text-steel-700 mb-1.5">Плотность, г/см³</label>
              <input
                type="number"
                step="0.01"
                value={customDensity}
                onChange={(e) => setCustomDensity(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {profile.fields.map((f) => (
              <div key={f.key} className={profile.fields.length > 3 && f.isLength ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium text-steel-600 mb-1">
                  {f.label}, {f.unit}
                </label>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={dimensions[f.key]}
                  onChange={(e) => setDim(f.key, Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-steel-600 mb-1">Количество, шт</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-steel-600 mb-1">Цена за кг, ₽</label>
              <input
                type="number"
                step="0.01"
                placeholder={String(defaultPrice)}
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value === '' ? '' : Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl bg-steel-900 text-white p-5 sm:p-6 flex flex-col justify-between">
          {result.error ? (
            <p className="text-red-400 text-sm">{result.error}</p>
          ) : (
            <>
              <p className="text-steel-400 text-sm mb-4">
                {profile.name} · {metal.name}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-steel-500 text-xs uppercase tracking-wider">Вес 1 шт</span>
                  <p className="text-2xl font-bold mt-1">
                    {result.weightPerPiece} <span className="text-base font-medium text-steel-400">кг</span>
                  </p>
                </div>
                <div>
                  <span className="text-steel-500 text-xs uppercase tracking-wider">Общий вес</span>
                  <p className="text-2xl font-bold mt-1">
                    {result.totalWeight} <span className="text-base font-medium text-steel-400">кг</span>
                  </p>
                </div>
                <div>
                  <span className="text-steel-500 text-xs uppercase tracking-wider">Объём</span>
                  <p className="text-2xl font-bold mt-1">
                    {result.volume} <span className="text-base font-medium text-steel-400">м³</span>
                  </p>
                </div>
                <div>
                  <span className="text-steel-500 text-xs uppercase tracking-wider">Площадь</span>
                  <p className="text-2xl font-bold mt-1">
                    {result.surfaceArea} <span className="text-base font-medium text-steel-400">м²</span>
                  </p>
                </div>
                {result.estimatedCost !== null && (
                  <div className="col-span-2">
                    <span className="text-steel-500 text-xs uppercase tracking-wider">Ориентир стоимости</span>
                    <p className="text-3xl font-bold text-green-400 mt-1">
                      {result.estimatedCost.toLocaleString('ru-RU')} <span className="text-base font-medium text-steel-400">₽</span>
                    </p>
                    <p className="text-xs text-steel-500 mt-1">без НДС, доставки и резки</p>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={addToSpec}
            disabled={!result.isValid}
            className="mt-5 w-full py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            + Добавить в спецификацию
          </button>
        </div>
      </div>

      {/* Specification table */}
      {spec.length > 0 && (
        <div className="rounded-xl border border-steel-300 overflow-hidden">
          <div className="metal-surface px-4 py-2.5 border-b border-steel-300 flex items-center justify-between">
            <span className="text-sm font-semibold text-steel-700">Спецификация ({spec.length})</span>
            <button
              type="button"
              onClick={downloadCSV}
              className="text-xs font-medium text-brand hover:underline"
            >
              Скачать CSV
            </button>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-steel-200">
            {spec.map((item, i) => (
              <div key={item.id} className="p-4 space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm text-steel-900">#{i + 1} {item.profileName}</span>
                  <button type="button" onClick={() => removeFromSpec(item.id)} className="text-red-500 text-xs">✕</button>
                </div>
                <p className="text-xs text-steel-500">{item.metalName} · {item.dimensions}</p>
                <p className="text-sm font-medium">{item.totalWeight} кг × {item.quantity} шт</p>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-steel-100 text-steel-600 text-left">
                  <th className="px-3 py-2">№</th>
                  <th className="px-3 py-2">Сортамент</th>
                  <th className="px-3 py-2">Марка</th>
                  <th className="px-3 py-2">Размеры</th>
                  <th className="px-3 py-2 text-right">Кол-во</th>
                  <th className="px-3 py-2 text-right">Вес, кг</th>
                  <th className="px-3 py-2 text-right">₽</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {spec.map((item, i) => (
                  <tr key={item.id} className="border-t border-steel-200">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{item.profileName}</td>
                    <td className="px-3 py-2">{item.metalName}</td>
                    <td className="px-3 py-2 text-steel-500">{item.dimensions}</td>
                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                    <td className="px-3 py-2 text-right font-medium">{item.totalWeight}</td>
                    <td className="px-3 py-2 text-right">{item.estimatedCost?.toLocaleString('ru-RU') ?? '—'}</td>
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => removeFromSpec(item.id)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-steel-300 bg-steel-50 font-semibold">
                  <td colSpan={5} className="px-3 py-2">Итого</td>
                  <td className="px-3 py-2 text-right">{totals.totalWeight} кг</td>
                  <td className="px-3 py-2 text-right">{totals.totalCost?.toLocaleString('ru-RU') ?? '—'}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 border-t border-steel-200 flex flex-col sm:flex-row gap-3">
            <a
              href="#zayavka"
              className="flex-1 text-center py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-light transition-colors min-h-[44px] flex items-center justify-center"
            >
              Отправить спецификацию менеджеру
            </a>
          </div>
        </div>
      )}

      <p className="text-xs text-steel-400 leading-relaxed">
        Расчёт теоретический по плотности марки и геометрии сечения (±1–3%). Не является публичной офертой.
        Для точной цены с НДС и доставкой — отправьте спецификацию.
      </p>
    </div>
  );
}
