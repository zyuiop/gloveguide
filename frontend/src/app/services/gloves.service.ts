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
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Glove} from '../data/gloves';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class GlovesService {
  private nextRefresh = 0;
  private cacheSubject = new BehaviorSubject<Glove[]>([]);

  constructor(private http: HttpClient) {
  }

  pullGloves(): Observable<Glove[]> {
    return this.http.get<Glove[]>(environment.backendUrl + '/gloves');
  }

  updateCachedGloves() {
    this.pullGloves().subscribe(res => this.cacheSubject.next(res));
  }

  getGloves(): Observable<Glove[]> {
    if (this.nextRefresh < Date.now()) {
      this.nextRefresh = Date.now() + 10 * 60 * 1000;
      this.updateCachedGloves();
    }
    return this.cacheSubject;
  }

  getGlove(id: number): Observable<Glove> {
    if (this.nextRefresh < Date.now()) {
      this.nextRefresh = Date.now() + 10 * 60 * 1000;
      this.updateCachedGloves();
    }
    return this.cacheSubject.pipe(map(lst => lst.filter(g => g.id === id)[0]));
  }
}
