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
