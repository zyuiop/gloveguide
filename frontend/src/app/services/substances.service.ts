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

import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Substance} from '../data/substance';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {handleError} from '../data/errors';

@Injectable({providedIn: 'root'})
export class SubstancesService {
  private nextRefresh = 0;
  private cacheSubject = new ReplaySubject<Substance[]>(1);

  constructor(private http: HttpClient) {
  }

  getSubstances(): Observable<Substance[]> {
    return this.http.get<Substance[]>(environment.backendUrl + '/substances')
      .pipe(catchError(handleError));
  }

  getSubstance(casNumber: string): Observable<Substance> {
    return this.http.get<Substance>(environment.backendUrl + '/substances/' + casNumber)
      .pipe(catchError(handleError));
  }

  searchSubstances(query: string): Observable<Substance[]> {
    return this.http.get<Substance[]>(environment.backendUrl + '/substances/search/' + query)
      .pipe(catchError(handleError));
  }

  updateCachedSubstances() {
    this.getSubstances().subscribe(res => this.cacheSubject.next(res));
  }

  getCachedSubstances(): Observable<Substance[]> {
    if (this.nextRefresh < Date.now()) {
      this.nextRefresh = Date.now() + 10 * 60 * 1000;
      this.updateCachedSubstances();
    }
    return this.cacheSubject;
  }

}
