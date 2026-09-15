export const SITE = {
  name: 'DELDIN TRADE',
  legalName: 'ООО «ДЕЛДИН-ТРЕЙД»',
  legalNameFull: 'Общество с ограниченной ответственностью «ДЕЛДИН-ТРЕЙД»',
  title: 'DELDIN TRADE — комплексные поставки металлопроката',
  description:
    'Металлотрейдер и комплексный B2B-поставщик. Подберём продукцию по спецификации, найдём редкие позиции, организуем обработку и доставим на объект по России.',
  url: 'https://deltrade.pages.dev',
  phone: '+7 (499) 393-30-04',
  phoneHref: 'tel:+74993933004',
  email: 'info@deldin-trade.ru',
  address: '143404, Московская область, г. о. Красногорск, г. Красногорск, ул. Дачная, д. 11А',
  workHours: 'пн–пт, 9:00–18:00',
} as const;

export const REQUISITES = {
  inn: '5024261177',
  kpp: '502401001',
  ogrn: '1265000027775',
  taxation: 'ОСНО',
  vat: '22%',
  director: 'Егоров Кирилл Максимович',
  bank: 'ПАО Сбербанк',
  bik: '044525225',
  account: '40702810840070010562',
  corrAccount: '30101810400000000225',
  edo: '2BM-5024261177-502401001-202604221021029558075',
  eis: '26038826',
} as const;

export const NAV_LINKS = [
  { href: '/katalog/', label: 'Каталог' },
  { href: '/uslugi/', label: 'Услуги' },
  { href: '/otrasli/', label: 'Отрасли' },
  { href: '/kalkulyator-metalla/', label: 'Калькулятор' },
  { href: '/keisy/', label: 'Кейсы' },
  { href: '/blog/', label: 'Блог' },
  { href: '/dokumenty/', label: 'Документы' },
  { href: '/geografiya/', label: 'География' },
  { href: '/o-kompanii/', label: 'О компании' },
  { href: '/kontakty/', label: 'Контакты' },
] as const;

/** Три стратегических направления по ТЗ (главная страница) */
export const MAIN_DIRECTIONS = [
  {
    slug: 'metalloprokat',
    title: 'Металлопрокат',
    description:
      'Чёрный, нержавеющий и цветной прокат: арматура, трубы, лист, профиль. Поставка по спецификации с сертификатами и ЭДО.',
    href: '/katalog/metalloprokat/',
    links: [
      { label: 'Металлопрокат', href: '/katalog/metalloprokat/' },
      { label: 'Спецстали', href: '/katalog/specialnye-stali/' },
      { label: 'Фасады и кровля', href: '/katalog/fasady-i-krovlya/' },
    ],
  },
  {
    slug: 'inzhenernye-sistemy',
    title: 'Инженерные системы',
    description:
      'Трубопроводная арматура, детали, канализация. Приоритет — безраструбная чугунная система SML по проекту.',
    href: '/katalog/inzhenernye-sistemy/',
    highlight: 'SML',
    links: [
      { label: 'Канализация SML', href: '/katalog/inzhenernye-sistemy/?subsection=kanalizaciya-sml' },
      { label: 'Запорная арматура', href: '/katalog/inzhenernye-sistemy/?subsection=armatura-zapornaya' },
      { label: 'Детали трубопроводов', href: '/katalog/inzhenernye-sistemy/?subsection=detali' },
    ],
  },
  {
    slug: 'metalloobrabotka',
    title: 'Металлообработка и изготовление',
    description:
      'Резка, гибка, сварка и изготовление по чертежам. Работаем с материалом поставщика, давальческое сырьё не принимаем.',
    href: '/uslugi/',
    links: [
      { label: 'Изготовление заготовок', href: '/uslugi/izgotovlenie-zagotovok/' },
      { label: 'Резка металла', href: '/uslugi/rezka-metalla/' },
      { label: 'По чертежам', href: '/uslugi/izgotovlenie-po-chertezham/' },
    ],
  },
] as const;

/** Порядок подгрупп инженерных систем по ТЗ */
export const ENGINEERING_SUBSECTION_ORDER = [
  'kanalizaciya-sml',
  'armatura-zapornaya',
  'detali',
  'truby',
] as const;

export const PRICE_DISCLAIMER =
  'Цены ориентировочные, обновляются два раза в месяц. Окончательная стоимость и наличие подтверждаются при расчёте.';

export const CATALOG_DIRECTIONS = [
  {
    slug: 'metalloprokat',
    title: 'Металлопрокат',
    description: 'Чёрный, нержавеющий и цветной металлопрокат',
    icon: '⬡',
  },
  {
    slug: 'specialnye-stali',
    title: 'Специальные стали',
    description: 'Редкие марки, сплавы и нестандартные позиции',
    icon: '◆',
  },
  {
    slug: 'metallokonstrukcii',
    title: 'Металлоконструкции',
    description: 'Изготовление и обработка по чертежам',
    icon: '▣',
  },
  {
    slug: 'inzhenernye-sistemy',
    title: 'Инженерные системы',
    description: 'Арматура, трубы, фитинги и оборудование',
    icon: '◎',
  },
  {
    slug: 'kanalizaciya',
    title: 'Канализация',
    description: 'Внутреннее и наружное водоотведение',
    icon: '⬤',
  },
  {
    slug: 'tehnicheskaya-izolyaciya',
    title: 'Техническая изоляция',
    description: 'Материалы для инженерных систем',
    icon: '▤',
  },
  {
    slug: 'elektrotehnika',
    title: 'Электротехника',
    description: 'Электротехническая продукция под проект',
    icon: '⚡',
  },
  {
    slug: 'fasady-i-krovlya',
    title: 'Фасады и кровля',
    description: 'Фасадные и кровельные материалы',
    icon: '⌂',
  },
  {
    slug: 'zashchita-ot-bpla',
    title: 'Защита от БПЛА',
    description: 'Решения для промышленных объектов',
    icon: '⛊',
  },
  {
    slug: 'kompleksnaya-komplektaciya',
    title: 'Комплексная комплектация',
    description: 'Многопозиционные заявки в одном проекте',
    icon: '⊞',
  },
] as const;

export const WORK_STEPS = [
  { step: 1, title: 'Заявка', description: 'Отправьте спецификацию или опишите задачу' },
  { step: 2, title: 'Подбор', description: 'Менеджер подберёт позиции и проверит наличие' },
  { step: 3, title: 'Предложение', description: 'Подготовим коммерческое предложение' },
  { step: 4, title: 'Закупка', description: 'Организуем закупку и обработку при необходимости' },
  { step: 5, title: 'Доставка', description: 'Доставим на объект по России' },
  { step: 6, title: 'Документы', description: 'Полный комплект закрывающих документов и ЭДО' },
] as const;
