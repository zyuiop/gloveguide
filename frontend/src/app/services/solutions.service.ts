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

import {BehaviorSubject, Observable} from 'rxjs';
import {Substance} from '../data/substance';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Solution} from '../data/solution';
import {GloveResult} from '../data/gloves';

@Injectable({providedIn: 'root'})
export class SolutionsService {
  private _solution: Solution = new Solution();

  constructor(private http: HttpClient) {
  }

  reset() {
    this._solution = new Solution();
  }

  get solution() {
    return this._solution;
  }

  searchGloves(solution: Solution): Observable<GloveResult[]> {
    return this.http.post<GloveResult[]>(environment.backendUrl + '/solutions/compute', solution);
  }

  addSubstance(subst: Substance) {
    this.solution.substances.push({substance: subst, proportion: this.missingProportion});
  }

  get totalProportion() {
    return this.solution.substances.map(subst => subst.proportion).reduce((prev, current) => prev + current, 0)
      + this.solution.water + this.solution.impurities;
  }

  get missingProportion() {
    return 100.0 - this.totalProportion;
  }
}
