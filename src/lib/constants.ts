export const SITE = {
  name: 'DELDIN TRADE',
  legalName: 'ООО «ДЕЛДИН ТРЕЙД»',
  title: 'DELDIN TRADE — комплексные поставки металлопроката',
  description:
    'Металлотрейдер и комплексный B2B-поставщик. Подберём продукцию по спецификации, найдём редкие позиции, организуем обработку и доставим на объект по России.',
  url: 'https://deltrade.pages.dev',
  phone: '+7 (495) 000-00-00',
  phoneHref: 'tel:+74950000000',
  email: 'info@deldin-trade.ru',
  address: 'г. Москва',
  workHours: 'пн–пт, 9:00–18:00',
} as const;

export const NAV_LINKS = [
  { href: '/katalog/', label: 'Каталог' },
  { href: '/uslugi/', label: 'Услуги' },
  { href: '/kalkulyator-metalla/', label: 'Калькулятор' },
  { href: '/o-kompanii/', label: 'О компании' },
  { href: '/kontakty/', label: 'Контакты' },
] as const;

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
