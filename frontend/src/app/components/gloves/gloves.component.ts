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

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GlovesService} from '../../services/gloves.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Glove} from '../../data/gloves';
import {map} from 'rxjs/operators';
import {ResistancesService} from '../../services/resistances.service';

@Component({
  selector: 'app-gloves',
  templateUrl: './gloves.component.html',
  styleUrls: ['./gloves.component.css']
})
export class GlovesComponent implements OnInit, OnChanges {
  @Input() filteredTypes: string[] = undefined;
  private sub = new BehaviorSubject<Glove[]>([]);

  gloves: Observable<Glove[]>;

  constructor(private service: GlovesService, private resistances: ResistancesService) {
  }

  ngOnInit(): void {
    this.gloves = this.sub
    .pipe(
      map(gloves => {
        if (!this.filteredTypes) {
          return gloves;
        } else {
          return gloves.filter(glove => glove.material.types.some(mat => this.filteredTypes.indexOf(mat) !== -1));
        }
      })
    );

    this.service.getGloves().subscribe(res => this.sub.next(res));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filteredTypes) this.sub.next(this.sub.value);
  }

}
