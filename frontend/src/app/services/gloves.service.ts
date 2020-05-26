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

import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Glove} from '../data/gloves';
import {catchError, delay, map, retryWhen, switchMap, tap} from 'rxjs/operators';
import {tryCatch} from 'rxjs/internal-compatibility';

@Injectable({providedIn: 'root'})
export class GlovesService {
  private nextRefresh = 0;
  private cacheSubject = new ReplaySubject<Glove[]>(1);

  constructor(private http: HttpClient) {
  }

  pullGloves(): Observable<Glove[]> {
    return this.http.get<Glove[]>(environment.backendUrl + '/gloves');
  }

  updateCachedGloves(): Observable<Glove[]> {
    this.nextRefresh = Date.now() + 10 * 60 * 1000;

    return this.pullGloves().pipe(tap(res => this.cacheSubject.next(res)), retryWhen(err => err.pipe(delay(1000))));
  }

  getGloves(): Observable<Glove[]> {
    if (this.nextRefresh < Date.now()) {
      this.updateCachedGloves().subscribe();
    }
    return this.cacheSubject;
  }

  getGlove(id: number): Observable<Glove> {
    if (this.nextRefresh < Date.now()) {
      this.updateCachedGloves().subscribe();
    }
    return this.cacheSubject.pipe(map(lst => lst.filter(g => g.id === id)[0]));
  }

  createGlove(glove: Glove): Observable<Glove> {
    return this.http.post<Glove>(environment.backendUrl + '/gloves', glove)
      .pipe(
        switchMap(value => this.updateCachedGloves().pipe(map(res => value)))
      );
  }

  updateGlove(id: number, glove: Glove): Observable<void> {
    return this.http.put<void>(environment.backendUrl + '/gloves/' + id, glove)
      .pipe(
        switchMap(value => this.updateCachedGloves().pipe(map(res => value)))
      );
  }

  loadGlove(id: number): Observable<Glove> {
    return this.http.get<Glove>(environment.backendUrl + '/gloves/' + id);
  }
}
