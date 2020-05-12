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

import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Glove} from '../../data/gloves';
import {ResistancesService} from '../../services/resistances.service';
import {GlovesService} from '../../services/gloves.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-create-glove',
  templateUrl: './create-glove.component.html',
  styleUrls: ['./create-glove.component.css']
})
export class CreateGloveComponent implements OnInit {
  glove$: Observable<Glove>;

  constructor(private resistancesService: ResistancesService, private gloves: GlovesService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // TODO: update depending on params (create or edit)
    this.glove$ = this.route.paramMap.pipe(
      map(m => m.get('glove')),
      switchMap(gloveId => {
        if (gloveId) {
          if (history.state.data) {
            return of(history.state.data as Glove);
          } else {
            return this.gloves.getGlove(Number.parseInt(gloveId, 10));
          }
        } else {
          const glove = new Glove();
          glove.powdered = false;
          glove.fingerTextured = false;
          return of(glove);
        }
      })
    );

  }
}
