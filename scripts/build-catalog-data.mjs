/**
 * Enriches products (300+ words, FAQ, related) and adds items for 9 catalog sections.
 * Run: node scripts/build-catalog-data.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = join(root, 'src/data/products.json');

const NEW_PRODUCTS = [
  // specialnye-stali
  { slug: 'krug-40h-50mm', section: 'specialnye-stali', subsection: 'instrumentalnye', title: 'Круг 40Х 50 мм', h1: 'Круг стальной 40Х 50 мм', gost: 'ГОСТ 4543-71', steelGrade: '40Х', diameter: 50, weightPerMeter: 15.42, pricePerTon: 92000, useCases: ['валы', 'шестерни', 'крепёж'] },
  { slug: 'krug-9hs-60mm', section: 'specialnye-stali', subsection: 'instrumentalnye', title: 'Круг 9ХС 60 мм', h1: 'Круг инструментальный 9ХС 60 мм', gost: 'ГОСТ 5950-2000', steelGrade: '9ХС', diameter: 60, weightPerMeter: 22.19, pricePerTon: 125000, useCases: ['режущий инструмент', 'штампы', 'пуансоны'] },
  { slug: 'list-40h-10mm', section: 'specialnye-stali', subsection: 'konstrukcionnye', title: 'Лист 40Х 10 мм', h1: 'Лист стальной 40Х 10 мм', gost: 'ГОСТ 19903-2015', steelGrade: '40Х', diameter: null, weightPerMeter: 78.5, pricePerTon: 98000, useCases: ['заготовки', 'плиты', 'ремонт'] },
  { slug: 'list-12h18n10t-3mm', section: 'specialnye-stali', subsection: 'nerzhaveyushchie', title: 'Лист 12Х18Н10Т 3 мм', h1: 'Лист нержавеющий 12Х18Н10Т 3 мм', gost: 'ГОСТ 19903-2015', steelGrade: '12Х18Н10Т', diameter: null, weightPerMeter: 23.55, pricePerTon: 285000, useCases: ['пищевая промышленность', 'химия', 'облицовка'] },
  { slug: 'krug-65g-30mm', section: 'specialnye-stali', subsection: 'konstrukcionnye', title: 'Круг 65Г 30 мм', h1: 'Круг пружинный 65Г 30 мм', gost: 'ГОСТ 14959-2016', steelGrade: '65Г', diameter: 30, weightPerMeter: 5.55, pricePerTon: 78000, useCases: ['пружины', 'рессоры', 'пружинная проволока'] },
  { slug: 'polosa-u8a-20x60', section: 'specialnye-stali', subsection: 'instrumentalnye', title: 'Полоса У8А 20×60 мм', h1: 'Полоса инструментальная У8А 20×60 мм', gost: 'ГОСТ 4405-75', steelGrade: 'У8А', diameter: null, weightPerMeter: 9.42, pricePerTon: 105000, useCases: ['ножи', 'фрезы', 'штампы'] },
  // metallokonstrukcii
  { slug: 'ferma-stalnaya-12m', section: 'metallokonstrukcii', subsection: 'fermy', title: 'Ферма стальная 12 м', h1: 'Ферма стальная пролётом 12 м', gost: 'по проекту', steelGrade: 'С245', diameter: null, weightPerMeter: 0, pricePerTon: 115000, useCases: ['склады', 'ангары', 'навесы'] },
  { slug: 'kolonna-stalnaya-6m', section: 'metallokonstrukcii', subsection: 'karkasy', title: 'Колонна стальная 6 м', h1: 'Колонна стальная 6 м', gost: 'по проекту', steelGrade: 'С345', diameter: null, weightPerMeter: 0, pricePerTon: 118000, useCases: ['каркасы', 'цехи', 'логистика'] },
  { slug: 'progon-balka-12m', section: 'metallokonstrukcii', subsection: 'fermy', title: 'Прогон балочный 12 м', h1: 'Прогон балочный 12 м', gost: 'по проекту', steelGrade: 'С245', diameter: null, weightPerMeter: 0, pricePerTon: 112000, useCases: ['кровля', 'навесы', 'террасы'] },
  { slug: 'svai-metallicheskie-3m', section: 'metallokonstrukcii', subsection: 'svai', title: 'Сваи металлические 3 м', h1: 'Сваи металлические 3 м', gost: 'по проекту', steelGrade: 'Ст3', diameter: null, weightPerMeter: 0, pricePerTon: 95000, useCases: ['фундаменты', 'заборы', 'малые здания'] },
  { slug: 'naves-skladnoj-15x30', section: 'metallokonstrukcii', subsection: 'karkasy', title: 'Навес складской 15×30 м', h1: 'Навес складской 15×30 м', gost: 'по проекту', steelGrade: 'С245', diameter: null, weightPerMeter: 0, pricePerTon: 125000, useCases: ['склады', 'логистика', 'парковки'] },
  { slug: 'lestnica-metallicheskaya', section: 'metallokonstrukcii', subsection: 'svai', title: 'Лестница металлическая', h1: 'Лестница металлическая пожарная', gost: 'ГОСТ Р 53254-2009', steelGrade: 'Ст3', diameter: null, weightPerMeter: 0, pricePerTon: 130000, useCases: ['эвакуация', 'технические помещения', 'промышленность'] },
  // inzhenernye-sistemy
  { slug: 'truba-vgp-25x3-2', section: 'inzhenernye-sistemy', subsection: 'truby', title: 'Труба ВГП 25×3,2 мм', h1: 'Труба водогазопроводная 25×3,2 мм', gost: 'ГОСТ 3262-75', steelGrade: 'Ст20', diameter: 25, weightPerMeter: 2.07, pricePerTon: 62000, useCases: ['отопление', 'водоснабжение', 'пар'] },
  { slug: 'truba-nerzh-aisi304-32', section: 'inzhenernye-sistemy', subsection: 'truby', title: 'Труба нерж. AISI 304 32×2 мм', h1: 'Труба нержавеющая AISI 304 32×2 мм', gost: 'ASTM A312', steelGrade: 'AISI 304', diameter: 32, weightPerMeter: 1.48, pricePerTon: 320000, useCases: ['пищевка', 'фарма', 'химия'] },
  { slug: 'flanec-stalnoj-du50', section: 'inzhenernye-sistemy', subsection: 'detali', title: 'Фланец стальной Ду50', h1: 'Фланец стальной приварной Ду50', gost: 'ГОСТ 33259-2015', steelGrade: 'Ст20', diameter: null, weightPerMeter: 0, pricePerTon: 85000, useCases: ['трубопроводы', 'насосные', 'котельные'] },
  { slug: 'otvod-90-du80', section: 'inzhenernye-sistemy', subsection: 'detali', title: 'Отвод 90° Ду80', h1: 'Отвод стальной 90° Ду80', gost: 'ГОСТ 17375-2001', steelGrade: 'Ст20', diameter: null, weightPerMeter: 0, pricePerTon: 72000, useCases: ['трубопроводы', 'ГВС', 'технологические линии'] },
  { slug: 'zadvizhka-stalnaya-du100', section: 'inzhenernye-sistemy', subsection: 'armatura-zapornaya', title: 'Задвижка стальная Ду100', h1: 'Задвижка стальная клиновая Ду100', gost: 'ГОСТ 5762-2002', steelGrade: 'Ст25', diameter: null, weightPerMeter: 0, pricePerTon: 145000, useCases: ['магистрали', 'котельные', 'насосные'] },
  { slug: 'kompensator-salnikovyj-du50', section: 'inzhenernye-sistemy', subsection: 'armatura-zapornaya', title: 'Компенсатор сальниковый Ду50', h1: 'Компенсатор сальниковый Ду50', gost: 'ГОСТ 14911-82', steelGrade: 'Ст20', diameter: null, weightPerMeter: 0, pricePerTon: 95000, useCases: ['теплотрассы', 'компенсация', 'инженерные сети'] },
  // kanalizaciya
  { slug: 'truba-pvc-110x3-2', section: 'kanalizaciya', subsection: 'truby-kanal', title: 'Труба ПВХ 110×3,2 мм', h1: 'Труба канализационная ПВХ 110 мм', gost: 'ГОСТ 32414-2013', steelGrade: 'ПВХ', diameter: 110, weightPerMeter: 1.9, pricePerTon: 95000, useCases: ['внутренняя канализация', 'частное строительство', 'ремонт'] },
  { slug: 'kolco-kolodca-kc10-9', section: 'kanalizaciya', subsection: 'kolodcy', title: 'Кольцо колодца КЦ 10-9', h1: 'Кольцо бетонное КЦ 10-9', gost: 'ГОСТ 8020-2016', steelGrade: 'бетон', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 4200, useCases: ['наружные сети', 'колодцы', 'водоотведение'] },
  { slug: 'lyuk-chugunnyj-t', section: 'kanalizaciya', subsection: 'kolodcy', title: 'Люк чугунный Т', h1: 'Люк чугунный легкий тип Т', gost: 'ГОСТ 3634-2019', steelGrade: 'СЧ20', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 6800, useCases: ['колодцы', 'коммуникации', 'благоустройство'] },
  { slug: 'truba-drenazhnaya-110', section: 'kanalizaciya', subsection: 'drenazh', title: 'Труба дренажная 110 мм', h1: 'Труба дренажная перфорированная 110 мм', gost: 'ТУ', steelGrade: 'ПНД', diameter: 110, weightPerMeter: 0.8, pricePerTon: 78000, useCases: ['дренаж участка', 'фундаменты', 'дороги'] },
  { slug: 'gofra-drenazhnaya-160', section: 'kanalizaciya', subsection: 'drenazh', title: 'Гофра дренажная 160 мм', h1: 'Гофрированная труба дренажная 160 мм', gost: 'ТУ', steelGrade: 'ПНД', diameter: 160, weightPerMeter: 1.2, pricePerTon: 82000, useCases: ['ливневка', 'отвод воды', 'ландшафт'] },
  { slug: 'kolodets-plastikovyj-1000', section: 'kanalizaciya', subsection: 'kolodcy', title: 'Колодец пластиковый 1000 мм', h1: 'Колодец полимерный 1000 мм', gost: 'ТУ', steelGrade: 'ПП', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 18500, useCases: ['канализация', 'осадконакопители', 'частный сектор'] },
  // tehnicheskaya-izolyaciya
  { slug: 'mat-bazaltovyj-50mm', section: 'tehnicheskaya-izolyaciya', subsection: 'mineralnaya', title: 'Мат базальтовый 50 мм', h1: 'Мат базальтовый теплоизоляционный 50 мм', gost: 'ГОСТ 21880-2011', steelGrade: 'базальт', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 420, useCases: ['трубопроводы', 'котельные', 'вентиляция'] },
  { slug: 'cylinder-truby-57mm-30', section: 'tehnicheskaya-izolyaciya', subsection: 'mineralnaya', title: 'Цилиндр на трубу 57 мм 30 мм', h1: 'Цилиндр теплоизоляционный 57×30 мм', gost: 'ТУ', steelGrade: 'минвата', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 280, useCases: ['отопление', 'пар', 'ГВС'] },
  { slug: 'penofol-a10-10mm', section: 'tehnicheskaya-izolyaciya', subsection: 'folgirovannaya', title: 'Пенофол А10 10 мм', h1: 'Пенофол А10 10 мм', gost: 'ТУ', steelGrade: 'полиэтилен', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 95, useCases: ['утепление', 'пароизоляция', 'фасады'] },
  { slug: 'izolyaciya-kashirovannaya-20', section: 'tehnicheskaya-izolyaciya', subsection: 'polimernaya', title: 'Изоляция кашированная 20 мм', h1: 'Изоляция кашированная фольгой 20 мм', gost: 'ТУ', steelGrade: 'вспененный полиэтилен', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 180, useCases: ['трубы', 'вентиляция', 'холодильное'] },
  { slug: 'skotch-armirovannyj-50', section: 'tehnicheskaya-izolyaciya', subsection: 'folgirovannaya', title: 'Скотч алюминиевый 50 мм', h1: 'Скотч алюминиевый армированный 50 мм', gost: 'ТУ', steelGrade: 'алюминий', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 320, useCases: ['монтаж изоляции', 'герметизация', 'вентиляция'] },
  { slug: 'penopleks-truba-89', section: 'tehnicheskaya-izolyaciya', subsection: 'polimernaya', title: 'Пеноплекс на трубу 89 мм', h1: 'Изоляция Пеноплекс на трубу 89 мм', gost: 'ТУ', steelGrade: 'XPS', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 650, useCases: ['наружные сети', 'канализация', 'водопровод'] },
  // elektrotehnika
  { slug: 'kabel-vvg-3x2-5', section: 'elektrotehnika', subsection: 'kabel', title: 'Кабель ВВГ 3×2,5', h1: 'Кабель ВВГнг 3×2,5 мм²', gost: 'ГОСТ 31996-2012', steelGrade: 'медь', diameter: null, weightPerMeter: 0.11, pricePerTon: 0, pricePerUnit: 68, useCases: ['силовые линии', 'щиты', 'освещение'] },
  { slug: 'shina-mednaya-5x30', section: 'elektrotehnika', subsection: 'shiny', title: 'Шина медная 5×30 мм', h1: 'Шина медная 5×30 мм', gost: 'ГОСТ 434-78', steelGrade: 'М1', diameter: null, weightPerMeter: 1.34, pricePerTon: 850000, useCases: ['щиты', 'распределение', 'заземление'] },
  { slug: 'lotok-kabelnyj-100x50', section: 'elektrotehnika', subsection: 'krepezh-elektro', title: 'Лоток кабельный 100×50', h1: 'Лоток кабельный перфорированный 100×50', gost: 'ГОСТ Р 52868-2007', steelGrade: 'оцинковка', diameter: null, weightPerMeter: 2.8, pricePerTon: 95000, useCases: ['кабельные трассы', 'промышленность', 'склады'] },
  { slug: 'klemma-nakladnaya-95', section: 'elektrotehnika', subsection: 'shiny', title: 'Клемма накладная 95 мм²', h1: 'Клемма накладная 95 мм²', gost: 'ТУ', steelGrade: 'медь', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 420, useCases: ['соединения', 'щиты', 'монтаж'] },
  { slug: 'provod-pv-3-6', section: 'elektrotehnika', subsection: 'kabel', title: 'Провод ПВ-3 6 мм²', h1: 'Провод установочный ПВ-3 6 мм²', gost: 'ГОСТ 31947-2012', steelGrade: 'медь', diameter: null, weightPerMeter: 0.055, pricePerTon: 0, pricePerUnit: 42, useCases: ['внутренняя проводка', 'щиты', 'оборудование'] },
  { slug: 'shkaf-uchetniy-navesnoy', section: 'elektrotehnika', subsection: 'krepezh-elektro', title: 'Шкаф учётный навесной', h1: 'Шкаф учётный навесной металлический', gost: 'ТУ', steelGrade: 'Ст3', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 12500, useCases: ['вводной учёт', 'частный сектор', 'объекты'] },
  // fasady-i-krovlya
  { slug: 'profnastil-s8-0-5', section: 'fasady-i-krovlya', subsection: 'profnastil', title: 'Профнастил С8 0,5 мм', h1: 'Профнастил С8 толщина 0,5 мм', gost: 'ГОСТ 24045-2016', steelGrade: 'оцинковка', diameter: null, weightPerMeter: 4.8, pricePerTon: 78000, useCases: ['заборы', 'навесы', 'облицовка'] },
  { slug: 'profnastil-ns35-0-7', section: 'fasady-i-krovlya', subsection: 'profnastil', title: 'Профнастил НС35 0,7 мм', h1: 'Профнастил несущий НС35 0,7 мм', gost: 'ГОСТ 24045-2016', steelGrade: 'оцинковка', diameter: null, weightPerMeter: 7.4, pricePerTon: 82000, useCases: ['кровля', 'перекрытия', 'навесы'] },
  { slug: 'metallocherepica-monterrey', section: 'fasady-i-krovlya', subsection: 'metallocherepica', title: 'Металлочерепица Монтеррей', h1: 'Металлочерепица Монтеррей 0,5 мм', gost: 'ТУ', steelGrade: 'полиэстер', diameter: null, weightPerMeter: 4.6, pricePerTon: 95000, useCases: ['кровля', 'коттеджи', 'коммерция'] },
  { slug: 'vodostok-metall-125', section: 'fasady-i-krovlya', subsection: 'vodostok', title: 'Водосток металлический 125 мм', h1: 'Водосточная система металлическая 125 мм', gost: 'ТУ', steelGrade: 'оцинковка', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 890, useCases: ['кровля', 'фасады', 'дренаж'] },
  { slug: 'sayding-metallicheskiy', section: 'fasady-i-krovlya', subsection: 'profnastil', title: 'Сайдинг металлический', h1: 'Сайдинг металлический вертикальный', gost: 'ТУ', steelGrade: 'полиэстер', diameter: null, weightPerMeter: 3.2, pricePerTon: 88000, useCases: ['фасады', 'облицовка', 'реконструкция'] },
  { slug: 'krepezh-krovlya-universal', section: 'fasady-i-krovlya', subsection: 'vodostok', title: 'Крепёж кровельный универсальный', h1: 'Комплект крепежа кровельного', gost: 'ТУ', steelGrade: 'оцинковка', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 12, useCases: ['монтаж кровли', 'профнастил', 'металлочерепица'] },
  // zashchita-ot-bpla
  { slug: 'setka-protiv-bpla-3mm', section: 'zashchita-ot-bpla', subsection: 'setki', title: 'Сетка против БПЛА 3 мм', h1: 'Сетка защитная против БПЛА 3 мм', gost: 'по проекту', steelGrade: 'Ст3', diameter: null, weightPerMeter: 0, pricePerTon: 145000, useCases: ['промышленность', 'энергетика', 'склады'] },
  { slug: 'komplekt-zashchity-bpla-m', section: 'zashchita-ot-bpla', subsection: 'komplekty', title: 'Комплект защиты от БПЛА М', h1: 'Комплект защиты от БПЛА средний', gost: 'по проекту', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 850000, useCases: ['объекты', 'инфраструктура', 'логистика'] },
  { slug: 'bashnya-osveshcheniya-12m', section: 'zashchita-ot-bpla', subsection: 'oborudovanie', title: 'Башня освещения 12 м', h1: 'Башня освещения 12 м', gost: 'по проекту', steelGrade: 'С245', diameter: null, weightPerMeter: 0, pricePerTon: 135000, useCases: ['периметр', 'освещение', 'безопасность'] },
  { slug: 'ukrytie-mobilnoe-bpla', section: 'zashchita-ot-bpla', subsection: 'komplekty', title: 'Укрытие мобильное от БПЛА', h1: 'Укрытие мобильное от БПЛА', gost: 'по проекту', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 420000, useCases: ['временные объекты', 'стройплощадки', 'склады'] },
  { slug: 'stoyka-krepleniya-setki', section: 'zashchita-ot-bpla', subsection: 'setki', title: 'Стойка крепления сетки', h1: 'Стойка крепления защитной сетки', gost: 'по проекту', steelGrade: 'С245', diameter: null, weightPerMeter: 0, pricePerTon: 118000, useCases: ['монтаж сеток', 'периметр', 'объекты'] },
  { slug: 'detektor-dronov-stacionar', section: 'zashchita-ot-bpla', subsection: 'oborudovanie', title: 'Детектор дронов стационарный', h1: 'Детектор БПЛА стационарный', gost: 'ТУ', steelGrade: 'электроника', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 320000, useCases: ['обнаружение', 'промышленность', 'критическая инфраструктура'] },
  // kompleksnaya-komplektaciya
  { slug: 'komplekt-fundament-armatura', section: 'kompleksnaya-komplektaciya', subsection: 'stroitelstvo', title: 'Комплект «Фундамент + арматура»', h1: 'Комплект материалов для фундамента', gost: 'по спецификации', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 0, useCases: ['жилые дома', 'склады', 'промышленность'] },
  { slug: 'komplekt-karkas-sklad', section: 'kompleksnaya-komplektaciya', subsection: 'promyshlennost', title: 'Комплект «Каркас склада»', h1: 'Комплект металлокаркаса склада', gost: 'по проекту', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 0, useCases: ['логистика', 'производство', 'ангары'] },
  { slug: 'komplekt-inzhenerka', section: 'kompleksnaya-komplektaciya', subsection: 'infrastruktura', title: 'Комплект «Инженерные сети»', h1: 'Комплект инженерных материалов', gost: 'по спецификации', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 0, useCases: ['ЖК', 'БЦ', 'промышленность'] },
  { slug: 'komplekt-krovlya-fasad', section: 'kompleksnaya-komplektaciya', subsection: 'stroitelstvo', title: 'Комплект «Кровля + фасад»', h1: 'Комплект кровельных и фасадных материалов', gost: 'по спецификации', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 0, useCases: ['реконструкция', 'коттеджи', 'коммерция'] },
  { slug: 'komplekt-prom-obekt', section: 'kompleksnaya-komplektaciya', subsection: 'promyshlennost', title: 'Комплект «Промышленный объект»', h1: 'Комплексная комплектация промобъекта', gost: 'по спецификации', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 0, useCases: ['заводы', 'цехи', 'модернизация'] },
  { slug: 'komplekt-infra-most', section: 'kompleksnaya-komplektaciya', subsection: 'infrastruktura', title: 'Комплект «Инфраструктура»', h1: 'Комплект для инфраструктурных проектов', gost: 'по спецификации', steelGrade: 'комплект', diameter: null, weightPerMeter: 0, pricePerTon: 0, pricePerUnit: 0, useCases: ['мосты', 'дороги', 'коммуникации'] },
];

function buildDescription(p) {
  const sectionNames = {
    metalloprokat: 'металлопроката',
    'specialnye-stali': 'специальных сталей',
    metallokonstrukcii: 'металлоконструкций',
    'inzhenernye-sistemy': 'инженерных систем',
    kanalizaciya: 'канализационных материалов',
    'tehnicheskaya-izolyaciya': 'технической изоляции',
    elektrotehnika: 'электротехнической продукции',
    'fasady-i-krovlya': 'фасадных и кровельных материалов',
    'zashchita-ot-bpla': 'решений защиты от БПЛА',
    'kompleksnaya-komplektaciya': 'комплексной комплектации',
  };
  const sec = sectionNames[p.section] || 'материалов';
  const uses = (p.useCases || []).join(', ');
  const weightLine = p.weightPerMeter > 0
    ? `Теоретический вес погонного метра составляет ${p.weightPerMeter} кг/м — параметр важен для логистики и расчёта нагрузок на конструкцию.`
    : 'Стоимость и масса рассчитываются по проектной спецификации и комплектации.';

  return [
    `${p.title} — позиция каталога DELDIN TRADE в разделе ${sec}. ${p.h1} поставляется по спецификации с полным комплектом сопроводительных документов: сертификаты, паспорта качества, УПД и обмен через ЭДО. Мы работаем с юридическими лицами и понимаем требования строительных, промышленных и инфраструктурных объектов.`,
    `Продукция соответствует ${p.gost}. Марка/материал: ${p.steelGrade}. ${weightLine} На рынке аналогичные позиции предлагают БВБ-Альянс, Метинвест-Сервис и региональные металлобазы — DELDIN TRADE отличается комплексным подходом: одна заявка, один менеджер, подбор аналогов при дефиците и организация доставки на объект по России.`,
    `Области применения: ${uses}. При необходимости выполним резку в размер, комплектацию сопутствующими позициями и координацию с партнёрами по металлообработке. Цена на сайте ориентировочная и не является публичной офертой — для коммерческого предложения с НДС и доставкой отправьте спецификацию или воспользуйтесь калькулятором металлопроката.`,
    `Логистика: отгрузка со складов партнёров, доставка автотранспортом и ж/д по согласованному графику. Для крупных проектов возможна поэтапная поставка. Менеджер DELDIN TRADE проверит наличие, сроки и предложит оптимальную конфигурацию партии под ваш бюджет и сроки строительства.`,
    `Чтобы заказать ${p.title.toLowerCase()}, заполните форму заявки на сайте, приложите ведомость или позвоните по телефону в рабочее время. Мы подготовим расчёт в течение одного рабочего дня и сопроводим сделку до полного комплекта закрывающих документов.`,
  ].join('\n\n');
}

function buildFaq(p) {
  return [
    { question: `Какой ГОСТ у ${p.title.toLowerCase()}?`, answer: `Позиция поставляется по ${p.gost}. При заказе предоставляем сертификаты и паспорта качества завода-изготовителя.` },
    { question: `Какая ориентировочная цена на ${p.title.toLowerCase()}?`, answer: p.pricePerUnit ? `Ориентир от ${p.pricePerUnit} ₽ за единицу. Точная цена зависит от объёма, сроков и региона доставки.` : `Ориентир от ${Math.round(p.pricePerTon / 1000)} ₽/кг (${p.pricePerTon.toLocaleString('ru-RU')} ₽/т). Точная цена — по запросу.` },
    { question: 'Можно ли заказать резку и доставку?', answer: 'Да. DELDIN TRADE организует резку в размер, комплектацию и доставку на объект по России. Укажите адрес и сроки в заявке.' },
    { question: 'Как быстро подготовите коммерческое предложение?', answer: 'Обычно в течение одного рабочего дня после получения спецификации. Для срочных заявок — по телефону.' },
  ];
}

function defaultPreset(p) {
  if (p.calculatorPreset) return p.calculatorPreset;
  if (p.subsection === 'armatura' || p.slug.includes('armatura')) {
    return { profileId: 'rebar', metalId: 'a3', dimensions: { d: p.diameter || 12, l: 1 } };
  }
  if (p.slug.includes('list')) return { profileId: 'sheet', metalId: 'st3', dimensions: { t: 3, b: 1000, l: 2000 } };
  if (p.slug.includes('truba') && p.slug.includes('profil')) return { profileId: 'pipe_rect', metalId: 'st3', dimensions: { a: 60, b: 60, s: 3, l: 1 } };
  if (p.slug.includes('truba')) return { profileId: 'pipe', metalId: 'st3', dimensions: { d: p.diameter || 57, s: 3.5, l: 1 } };
  if (p.slug.includes('ugolok')) return { profileId: 'angle', metalId: 'st3', dimensions: { a: 50, b: 50, t: 5, l: 1 } };
  if (p.slug.includes('shveller')) return { profileId: 'channel', metalId: 'st3', dimensions: { h: 100, b: 46, t: 4.5, l: 1 } };
  if (p.slug.includes('dvutavr')) return { profileId: 'ibeam', metalId: 'st3', dimensions: { h: 200, b: 100, t: 5.6, l: 1 } };
  if (p.slug.includes('krug')) return { profileId: 'round', metalId: p.steelGrade.includes('40') ? 'st40x' : 'st3', dimensions: { d: p.diameter || 20, l: 1 } };
  if (p.slug.includes('polosa')) return { profileId: 'strip', metalId: 'st3', dimensions: { t: 4, b: 40, l: 1 } };
  if (p.slug.includes('shestigrannik')) return { profileId: 'hex', metalId: 'st3', dimensions: { s: 19, l: 1 } };
  return { profileId: 'sheet', metalId: 'st3', dimensions: { t: 3, b: 1000, l: 2000 } };
}

const existing = JSON.parse(readFileSync(productsPath, 'utf8'));
const existingSlugs = new Set(existing.map((p) => p.slug));

const newOnes = NEW_PRODUCTS.map((p) => ({
  ...p,
  pricePerTon: p.pricePerTon ?? 0,
  pricePerUnit: p.pricePerUnit ?? null,
  description: '',
  useCases: p.useCases,
  calculatorPreset: defaultPreset(p),
}));

const merged = [...existing];
for (const p of newOnes) {
  if (!existingSlugs.has(p.slug)) merged.push(p);
}

// enrich all
for (const p of merged) {
  p.description = buildDescription(p);
  p.faq = buildFaq(p);
  p.calculatorPreset = p.calculatorPreset || defaultPreset(p);
}

// related slugs: same subsection then same section
for (const p of merged) {
  const sameSub = merged.filter((x) => x.subsection === p.subsection && x.slug !== p.slug);
  const sameSec = merged.filter((x) => x.section === p.section && x.slug !== p.slug && x.subsection !== p.subsection);
  p.relatedSlugs = [...sameSub, ...sameSec].slice(0, 4).map((x) => x.slug);
}

writeFileSync(productsPath, JSON.stringify(merged, null, 2) + '\n');
console.log(`Products: ${merged.length} (${newOnes.length} new)`);
