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

export enum Rating {
  GOOD = 'Good', MEDIUM = 'Medium', PASSABLE = 'Passable', POOR = 'Poor'
}

export const Ratings = [Rating.GOOD, Rating.MEDIUM, Rating.PASSABLE, Rating.GOOD];

export function strToRating(str: string | Rating): Rating {
  if (typeof str === 'string') {
    switch (str) {
      case 'Good':
        return Rating.GOOD;
      case 'Medium':
        return Rating.MEDIUM;
      case 'Passable':
        return Rating.PASSABLE;
      case 'Poor':
        return Rating.POOR;
      default:
        return undefined;
    }
  } else {
    return str as Rating;
  }
}
