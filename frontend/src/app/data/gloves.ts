/*
 *     EPFL Gloves Guide - An application to help you choose the best gloves for a chemical work
 *     Copyright (C) 2020 - Louis Vialar & EPFL GSCP
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
