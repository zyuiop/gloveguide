import {Rating} from './rating';

export class GloveResult {
  material: string;
  resistance: Rating;
}

export class GloveManufacturer {
  name: string;
  website?: string;
}

export class GloveMaterial {
  name: string;
  types: string[];
}

export class GloveGlassHandling {
  glassHandling: Rating;
  leavesMarks: boolean;
}

export class Glove {
  id?: number;
  manufacturer: GloveManufacturer;
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
  glassHandling: Map<string, GloveGlassHandling>; // Map[String, GlassHandling]
  tractionResistance: Map<string, Rating>; // Map[String, Rating.Value]
}
