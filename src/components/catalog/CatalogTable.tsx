import { useEffect, useMemo, useState } from 'react';

export interface CatalogTableProduct {
  slug: string;
  title: string;
  gost: string;
  steelGrade: string;
  diameter: number | null;
  weightPerMeter: number;
  priceValue: string;
  priceUnit: string;
  subsection: string;
  subsectionTitle: string;
}

interface Subsection {
  slug: string;
  title: string;
  count: number;
}

interface Props {
  products: CatalogTableProduct[];
  subsections: Subsection[];
  section: string;
}

export default function CatalogTable({ products, subsections, section }: Props) {
  const [activeSubsection, setActiveSubsection] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sub = params.get('subsection');
    if (sub && subsections.some((s) => s.slug === sub)) {
      setActiveSubsection(sub);
    }
  }, [subsections]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeSubsection) {
      list = list.filter((p) => p.subsection === activeSubsection);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.gost.toLowerCase().includes(q) ||
          p.steelGrade.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, activeSubsection, search]);

  const setSubsection = (slug: string) => {
    setActiveSubsection(slug);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set('subsection', slug);
    else url.searchParams.delete('subsection');
    window.history.replaceState({}, '', url.toString());
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-steel-300 bg-white text-steel-900 text-sm min-h-[44px] focus:outline-2 focus:outline-brand focus:border-brand';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Поиск по наименованию, ГОСТ, марке…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} sm:max-w-sm`}
        />
        {subsections.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSubsection('')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                !activeSubsection
                  ? 'bg-brand text-white'
                  : 'metal-border bg-white text-steel-600 hover:border-brand'
              }`}
            >
              Все ({products.length})
            </button>
            {subsections.map((sub) => (
              <button
                key={sub.slug}
                type="button"
                onClick={() => setSubsection(sub.slug)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                  activeSubsection === sub.slug
                    ? 'bg-brand text-white'
                    : 'metal-border bg-white text-steel-600 hover:border-brand'
                }`}
              >
                {sub.title} ({sub.count})
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-steel-500">
        Показано {filtered.length} из {products.length}. Цены ориентировочные — окончательная стоимость при расчёте.
      </p>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((product) => (
          <a
            key={product.slug}
            href={`/katalog/product/${product.slug}/`}
            className="block rounded-xl metal-border bg-white p-4 hover:border-brand transition-colors"
          >
            <h2 className="font-bold text-steel-900 text-sm leading-snug">{product.title}</h2>
            <p className="mt-1 text-xs text-steel-400">{product.gost}</p>
            <div className="mt-2 flex justify-between items-end text-sm">
              <span className="text-steel-500">
                {product.weightPerMeter > 0 ? `${product.weightPerMeter} кг/м` : product.steelGrade}
              </span>
              <span className="font-semibold text-brand">
                {product.priceValue} {product.priceUnit}
              </span>
            </div>
          </a>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-steel-500 py-8">Позиции не найдены. Отправьте спецификацию — подберём под задачу.</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl metal-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-steel-100 text-steel-600 text-left">
              <th className="px-4 py-3 font-semibold">Наименование</th>
              <th className="px-4 py-3 font-semibold">ГОСТ</th>
              <th className="px-4 py-3 font-semibold">Марка</th>
              <th className="px-4 py-3 font-semibold text-right">Ø, мм</th>
              <th className="px-4 py-3 font-semibold text-right">Вес</th>
              <th className="px-4 py-3 font-semibold text-right">Цена</th>
              <th className="px-4 py-3 font-semibold text-right">Ед.</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.slug} className="border-t border-steel-200 hover:bg-steel-50">
                <td className="px-4 py-3 font-medium text-steel-900">
                  <a href={`/katalog/product/${product.slug}/`} className="hover:text-brand">
                    {product.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-steel-500 text-xs">{product.gost}</td>
                <td className="px-4 py-3 text-steel-600">{product.steelGrade}</td>
                <td className="px-4 py-3 text-right text-steel-500">{product.diameter ?? '—'}</td>
                <td className="px-4 py-3 text-right text-steel-500">
                  {product.weightPerMeter > 0 ? `${product.weightPerMeter} кг/м` : '—'}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-brand whitespace-nowrap">
                  {product.priceValue}
                </td>
                <td className="px-4 py-3 text-right text-steel-500 text-xs">{product.priceUnit || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/katalog/product/${product.slug}/`}
                    className="text-brand hover:underline text-xs font-medium whitespace-nowrap"
                  >
                    В заявку →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-steel-500 py-8">Позиции не найдены.</p>
        )}
      </div>
    </div>
  );
}
