import type { CalcInput, CalcResult, Metal, Profile, WholeUnitVariant } from './types';
import { calcSurfaceArea, calcVolume, calcWeightKg, getLengthM } from './formulas';
import { validateDimensions } from './validate';

export function calculate(
  input: CalcInput,
  profile: Profile,
  metal: Metal,
): CalcResult {
  const density = input.metalId === 'custom' && input.customDensity
    ? input.customDensity
    : metal.density;

  const error = validateDimensions(profile, input.dimensions);
  if (error) {
    return emptyResult(error);
  }

  let quantity = input.quantity || 1;
  let dimensions = { ...input.dimensions };

  const weightPerPiece = calcWeightKg(profile.id, dimensions, density, profile.fields);

  if (input.mode === 'length' && input.targetWeight && input.targetWeight > 0 && weightPerPiece > 0) {
    const totalPiecesWeight = input.targetWeight;
    quantity = 1;
    const lengthField = profile.fields.find((f) => f.isLength);
    if (lengthField) {
      const neededLength = totalPiecesWeight / (weightPerPiece / getLengthM(dimensions, profile.fields));
      dimensions[lengthField.key] = neededLength;
    }
  }

  if (input.mode === 'quantity' && input.targetWeight && input.targetWeight > 0 && weightPerPiece > 0) {
    quantity = Math.ceil(input.targetWeight / weightPerPiece);
  }

  const finalWeightPerPiece = calcWeightKg(profile.id, dimensions, density, profile.fields);
  const totalWeight = finalWeightPerPiece * quantity;
  const volume = calcVolume(profile.id, dimensions, profile.fields) * quantity;
  const surfaceArea = calcSurfaceArea(profile.id, dimensions, profile.fields) * quantity;
  const lengthM = getLengthM(dimensions, profile.fields);
  const estimatedCost = input.pricePerKg ? totalWeight * input.pricePerKg : null;

  return {
    weightPerPiece: round(finalWeightPerPiece, 3),
    totalWeight: round(totalWeight, 3),
    volume: round(volume, 6),
    surfaceArea: round(surfaceArea, 3),
    lengthM: round(lengthM, 3),
    quantity,
    estimatedCost: estimatedCost ? round(estimatedCost, 2) : null,
    isValid: true,
  };
}

function round(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/** Варианты целого количества хлыстов/листов ниже и выше запрошенного объёма (логика 23met) */
export function calcWholeUnitVariants(
  input: CalcInput,
  profile: Profile,
  metal: Metal,
  barLengthM: number,
): WholeUnitVariant[] {
  if (!input.targetWeight || input.targetWeight <= 0 || barLengthM <= 0) return [];
  if (input.mode !== 'length' && input.mode !== 'quantity') return [];

  const density =
    input.metalId === 'custom' && input.customDensity ? input.customDensity : metal.density;

  const error = validateDimensions(profile, input.dimensions);
  if (error) return [];

  const lengthField = profile.fields.find((f) => f.isLength);
  if (!lengthField) return [];

  const barDims = { ...input.dimensions, [lengthField.key]: barLengthM };
  const weightPerBar = calcWeightKg(profile.id, barDims, density, profile.fields);
  if (weightPerBar <= 0) return [];

  const weightPerMeter = weightPerBar / barLengthM;
  const targetLengthM = input.targetWeight / weightPerMeter;

  const floorQty = Math.max(1, Math.floor(targetLengthM / barLengthM));
  const ceilQty = Math.max(1, Math.ceil(targetLengthM / barLengthM));

  const pricePerKg = input.pricePerKg ?? 0;
  const build = (qty: number, label: WholeUnitVariant['label']): WholeUnitVariant => {
    const totalLengthM = qty * barLengthM;
    const totalWeight = weightPerBar * qty;
    return {
      quantity: qty,
      totalLengthM: round(totalLengthM, 2),
      totalWeight: round(totalWeight, 2),
      deviationM: round(totalLengthM - targetLengthM, 2),
      estimatedCost: pricePerKg > 0 ? round(totalWeight * pricePerKg, 2) : null,
      label,
    };
  };

  const variants: WholeUnitVariant[] = [];
  if (floorQty === ceilQty) {
    variants.push(build(floorQty, 'точно'));
  } else {
    variants.push(build(floorQty, 'ниже'));
    variants.push(build(ceilQty, 'выше'));
  }
  return variants;
}

function emptyResult(error: string): CalcResult {
  return {
    weightPerPiece: 0,
    totalWeight: 0,
    volume: 0,
    surfaceArea: 0,
    lengthM: 0,
    quantity: 0,
    estimatedCost: null,
    isValid: false,
    error,
  };
}
