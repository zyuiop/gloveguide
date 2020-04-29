import {Rating} from './rating';

export class GloveResult {
  material: string;
  resistance: Rating;
}

export class GloveMaterial {
  name: string;
  types: string[];
}

export class GloveGlassHandling {
  humidifier: string;
  glassHandling: Rating;
  leavesMarks: boolean;
}
export class GloveTractionResistance {
  humidifier: string;
  tractionResistance: Rating;
}

export class Glove {
  id?: number;
  brand: string;
  material: GloveMaterial;
  name: string;
  reference: string;
  length: number;
  thickness: number;
  standardType: string;
  standardResistance: string;
  aql: number;
  easeToWear: Rating;
  easeToRemove: Rating;
  recommendations: string;
  ranking: number;
  rankingCategory: Rating;
  glassHandling: GloveGlassHandling[]; // Map[String, GlassHandling]
  tractionResistance: GloveTractionResistance[]; // Map[String, Rating.Value]
  powdered: boolean;
  fingerTextured: boolean;
  vulcanizationAgent?: string;
}
