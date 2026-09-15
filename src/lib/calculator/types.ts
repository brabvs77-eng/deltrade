export type CalcMode = 'weight' | 'length' | 'quantity';

export interface ProfileField {
  key: string;
  label: string;
  unit: string;
  default: number;
  isLength?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  icon: string;
  fields: ProfileField[];
}

export interface Metal {
  id: string;
  group: string;
  name: string;
  density: number;
}

export interface CalcInput {
  profileId: string;
  metalId: string;
  customDensity?: number;
  dimensions: Record<string, number>;
  quantity: number;
  pricePerKg?: number;
  mode: CalcMode;
  targetWeight?: number;
}

export interface CalcResult {
  weightPerPiece: number;
  totalWeight: number;
  volume: number;
  surfaceArea: number;
  lengthM: number;
  quantity: number;
  estimatedCost: number | null;
  isValid: boolean;
  error?: string;
}

export interface WholeUnitVariant {
  quantity: number;
  totalLengthM: number;
  totalWeight: number;
  deviationM: number;
  estimatedCost: number | null;
  label: 'ниже' | 'выше' | 'точно';
}

export interface SpecItem {
  id: string;
  profileName: string;
  metalName: string;
  dimensions: string;
  quantity: number;
  weightPerPiece: number;
  totalWeight: number;
  volume: number;
  surfaceArea: number;
  estimatedCost: number | null;
}
