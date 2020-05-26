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

import {Substance} from './substance';
import {Glove} from './gloves';

export class Resistance {
  substance: Substance;
  glove?: Glove;
  concentration: number;
  min: number;
  max: number;
  remarks?: string;
}

/**
 * Parses a string resistance ("< 10'", for example) to a [min, max] minutes array.
 */
export function parseResistance(stringResistance: string): number[] {
  const resistance = stringResistance.trim().replace(' ', '');
  const ht = />([0-9]+)'?/.exec(resistance);
  const lt = /<([0-9]+)'?/.exec(resistance);
  const interval = /([0-9]+)'?-([0-9]+)'?/.exec(resistance);
  const fixed = /([0-9]+)'?/.exec(resistance);

  if (ht) {
    return [Number.parseInt(ht[1], 10), 0];
  } else if (lt) {
    return [0, Number.parseInt(lt[1], 10)];
  } else if (interval) {
    return [Number.parseInt(interval[1], 10), Number.parseInt(interval[2], 10)];
  } else if (fixed) {
    return [Number.parseInt(fixed[1], 10), Number.parseInt(fixed[1], 10)];
  } else if (resistance === '' || resistance === '/') {
    return [null, null];
  } else if (resistance.startsWith('Retrait') || resistance.startsWith('Immediate')) {
    return [0, -1]; // "imminent retreat"
  } else {
    return undefined;
  }
}

export function sortResistances(r1: Resistance, r2: Resistance) {
  if (r1 === undefined || r1.min === undefined) {
    return (r2 === undefined || r2.min === undefined) ? 0 : 1;
  } else if (r2 === undefined || r2.min === undefined) {
    return -1;
  } else {
    if (r1.min === r2.min) {
      return r2.max - r1.max;
    } else {
      return r2.min - r1.min;
    }
  }
}

export function resistanceToString(resistance: Resistance) {
  if (resistance === undefined) {
    return 'No data';
  }

  const min = resistance.min;
  const max = resistance.max;

  if ((min === null || min === undefined) && (max === null || max === undefined)) {
    return 'No data';
  } else if (min === 0 && max === -1) {
    return 'Immediate withdraw';
  } else if (min > 0 && max === 0) {
    return '> ' + min + '\'';
  } else if (min === 0 && max > 0) {
    return '< ' + max + '\'';
  } else if (min === max) {
    return min + '\'';
  } else {
    return min + '\' - ' + max + '\'';
  }
}

/**
 * Get the right CSS class for this substance
 * @param resistance
 */
export function resistanceToClass(resistance: Resistance) {
  if (resistance === undefined) return [];

  const min = resistance.min;
  const max = resistance.max;

  if ((min === null || min === undefined) && (max === null || max === undefined)) {
    return [];
  } else if (min === 0 && max === -1) {
    return ['table-danger'];
  }

  const v = min === 0 ? max : min;

  if (v <= 10) {
    return ['table-danger'];
  } else if (v <= 120) {
    return ['table-warning'];
  } else {
    return ['table-success'];
  }
}
