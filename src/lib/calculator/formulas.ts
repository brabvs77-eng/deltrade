const PI = Math.PI;

/** Get length in meters from dimensions */
export function getLengthM(dimensions: Record<string, number>, fields: { key: string; isLength?: boolean }[]): number {
  const lengthField = fields.find((f) => f.isLength);
  if (!lengthField) {
    const l = dimensions.l ?? 0;
    return l / 1000;
  }
  return dimensions[lengthField.key] ?? 0;
}

/** Cross-section area in mm² */
export function getCrossSectionArea(profileId: string, d: Record<string, number>): number {
  switch (profileId) {
    case 'sheet':
    case 'plate':
    case 'strip':
      return (d.t ?? 0) * (d.b ?? 0);
    case 'round':
    case 'rebar':
    case 'wire': {
      const r = (d.d ?? 0) / 2;
      return PI * r * r;
    }
    case 'square':
      return (d.a ?? 0) ** 2;
    case 'hex': {
      const s = d.s ?? 0;
      return (Math.sqrt(3) / 2) * s * s;
    }
    case 'pipe': {
      const D = d.d ?? 0;
      const S = d.s ?? 0;
      return PI * ((D / 2) ** 2 - ((D - 2 * S) / 2) ** 2);
    }
    case 'pipe_rect': {
      const a = d.a ?? 0;
      const b = d.b ?? 0;
      const s = d.s ?? 0;
      return 2 * s * (a + b - 2 * s);
    }
    case 'angle': {
      const a = d.a ?? 0;
      const b = d.b ?? 0;
      const t = d.t ?? 0;
      return (a + b - t) * t;
    }
    case 'channel': {
      const h = d.h ?? 0;
      const b = d.b ?? 0;
      const t = d.t ?? 0;
      return (h + 2 * (b - t)) * t;
    }
    case 'ibeam': {
      const h = d.h ?? 0;
      const b = d.b ?? 0;
      const t = d.t ?? 0;
      return (h + 2 * (b - t)) * t;
    }
    case 'custom':
      return d.area ?? 0;
    default:
      return 0;
  }
}

/** Weight per piece in kg */
export function calcWeightKg(
  profileId: string,
  dimensions: Record<string, number>,
  density: number,
  fields: { key: string; isLength?: boolean }[],
): number {
  const area = getCrossSectionArea(profileId, dimensions);
  const lengthMm = getLengthM(dimensions, fields) * 1000;
  return (area * lengthMm * density) / 1_000_000;
}

/** Volume in m³ */
export function calcVolume(profileId: string, dimensions: Record<string, number>, fields: { key: string; isLength?: boolean }[]): number {
  const area = getCrossSectionArea(profileId, dimensions);
  const lengthM = getLengthM(dimensions, fields);
  return (area * lengthM * 1000) / 1_000_000_000;
}

/** Surface area in m² (approximate, for painting) */
export function calcSurfaceArea(
  profileId: string,
  dimensions: Record<string, number>,
  fields: { key: string; isLength?: boolean }[],
): number {
  const lengthM = getLengthM(dimensions, fields);

  switch (profileId) {
    case 'sheet':
    case 'plate':
      return 2 * ((dimensions.b ?? 0) * (dimensions.l ?? dimensions.t ?? 0)) / 1_000_000;
    case 'round':
    case 'rebar':
    case 'wire':
    case 'pipe':
      return (PI * (dimensions.d ?? 0) * lengthM * 1000) / 1000;
    case 'square':
      return (4 * (dimensions.a ?? 0) * lengthM * 1000) / 1000;
    case 'pipe_rect': {
      const a = dimensions.a ?? 0;
      const b = dimensions.b ?? 0;
      return (2 * (a + b) * lengthM * 1000) / 1000;
    }
    case 'strip':
      return (2 * ((dimensions.b ?? 0) + (dimensions.t ?? 0)) * lengthM * 1000) / 1000;
    default:
      return (2 * Math.sqrt(getCrossSectionArea(profileId, dimensions)) * lengthM * 1000) / 1000;
  }
}
