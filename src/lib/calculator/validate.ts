import type { Profile } from './types';

export function validateDimensions(profile: Profile, dimensions: Record<string, number>): string | null {
  for (const field of profile.fields) {
    const val = dimensions[field.key];
    if (val === undefined || val <= 0) {
      return `Укажите корректное значение: ${field.label}`;
    }
  }

  switch (profile.id) {
    case 'pipe': {
      const d = dimensions.d ?? 0;
      const s = dimensions.s ?? 0;
      if (s >= d / 2) return 'Стенка трубы не может быть ≥ половины диаметра';
      break;
    }
    case 'pipe_rect': {
      const a = dimensions.a ?? 0;
      const b = dimensions.b ?? 0;
      const s = dimensions.s ?? 0;
      if (s >= Math.min(a, b) / 2) return 'Стенка не может быть ≥ половины меньшей стороны';
      break;
    }
    case 'angle': {
      const a = dimensions.a ?? 0;
      const b = dimensions.b ?? 0;
      const t = dimensions.t ?? 0;
      if (t >= Math.min(a, b)) return 'Толщина уголка не может быть ≥ полки';
      break;
    }
  }

  return null;
}
