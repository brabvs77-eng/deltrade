import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export type BlogCategorySlug = BlogPost['data']['category'];

export interface BlogCategory {
  slug: BlogCategorySlug;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'truby',
    title: 'Трубы и отрезные заготовки',
    shortTitle: 'Трубы',
    description:
      'Электросварные и бесшовные трубы, резка в размер, расчёт веса и приёмка партии на объекте.',
    icon: '◎',
  },
  {
    slug: 'detali-truboprovodov',
    title: 'Детали трубопроводов',
    shortTitle: 'Детали трубопроводов',
    description:
      'Отводы, тройники, переходы, фланцы и крепёж: как собрать комплект и проверить соответствие проекту.',
    icon: '⌇',
  },
  {
    slug: 'armatura',
    title: 'Запорная арматура и компенсаторы',
    shortTitle: 'Арматура',
    description:
      'Задвижки, дисковые затворы, электроприводы и сильфонные компенсаторы: подбор, аналоги, опросные листы.',
    icon: '⛯',
  },
  {
    slug: 'listovye-zagotovki',
    title: 'Листовые заготовки и обработка',
    shortTitle: 'Листовые заготовки',
    description:
      'Толстый лист, гидроабразивная и термическая резка, чертежи, допуски и структура стоимости заготовки.',
    icon: '▤',
  },
  {
    slug: 'kanalizaciya-teplo',
    title: 'Канализация и теплоснабжение',
    shortTitle: 'Канализация и тепло',
    description:
      'SML и пластиковые системы, наружная и внутренняя канализация, комплектация теплового пункта.',
    icon: '⬤',
  },
  {
    slug: 'profnastil',
    title: 'Профнастил',
    shortTitle: 'Профнастил',
    description:
      'Марки, толщина, покрытие, несущие профили, полезная ширина и комплект с доборными элементами.',
    icon: '⌂',
  },
  {
    slug: 'komplektaciya',
    title: 'Комплектация и условия поставки',
    shortTitle: 'Комплектация',
    description:
      'Многопозиционные заявки, срочная докомплектация, замены, документы, графики и условия расчётов.',
    icon: '⊞',
  },
];

export function getCategory(slug: BlogCategorySlug): BlogCategory {
  const found = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown blog category: ${slug}`);
  return found;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => a.data.number - b.data.number);
}

export async function getPostsByCategory(
  category: BlogCategorySlug
): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.data.category === category);
}

export async function getPriorityPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.data.priority);
}

/**
 * Related posts by explicit `related` slugs, topped up with same-category
 * neighbours so every article ends with at least `limit` onward links.
 */
export async function getRelatedPosts(
  post: BlogPost,
  limit = 3
): Promise<BlogPost[]> {
  const all = await getAllPosts();
  const byId = new Map(all.map((p) => [p.id, p]));

  const picked: BlogPost[] = [];
  for (const slug of post.data.related) {
    const match = byId.get(slug);
    if (match && match.id !== post.id) picked.push(match);
  }

  if (picked.length < limit) {
    const sameCategory = all.filter(
      (p) =>
        p.data.category === post.data.category &&
        p.id !== post.id &&
        !picked.some((x) => x.id === p.id)
    );
    picked.push(...sameCategory.slice(0, limit - picked.length));
  }

  return picked.slice(0, limit);
}

/** Rough Russian reading time: ~180 words per minute, minimum 3 minutes. */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 180));
}
