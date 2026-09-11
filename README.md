# DELDIN TRADE

Корпоративный B2B-сайт металлотрейдера ООО «ДЕЛДИН ТРЕЙД».

## Стек

- [Astro 5](https://astro.build) — SSG, максимальная скорость
- [Tailwind CSS 4](https://tailwindcss.com) — mobile-first стили
- [React](https://react.dev) — интерактивные острова (калькулятор)

## Разработка

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build
npm run preview  # preview build
```

## Бренд

| Цвет | HEX |
|------|-----|
| Зелёный (акцент) | `#14452F` |
| Белый | `#F5F5F5` |
| Чёрный | `#000000` |

## Структура

```
src/
├── components/
│   ├── home/       # блоки главной
│   ├── layout/     # header, footer, mobile CTA
│   └── ui/         # UI-kit (кнопки, карточки, металлические элементы)
├── data/           # JSON данные (металлы, профили, цены)
├── layouts/        # BaseLayout
├── lib/
│   ├── calculator/ # формулы и логика калькулятора
│   └── seo/        # meta, schema.org
├── pages/          # маршруты
└── styles/         # global.css + металлические утилиты
```
