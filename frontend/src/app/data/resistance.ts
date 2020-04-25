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

export function sortResistances(r1: Resistance, r2: Resistance) {
  if (r1.min === undefined) {
    return r2.min === undefined ? 0 : 1;
  } else if (r2.min === undefined) {
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
