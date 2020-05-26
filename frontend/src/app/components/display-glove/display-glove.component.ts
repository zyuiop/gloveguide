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
import {Resistance} from '../../data/resistance';
import {ResistancesService} from '../../services/resistances.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Glove} from '../../data/gloves';
import {GlovesService} from '../../services/gloves.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ResistanceModalComponent} from '../resistance-modal/resistance-modal.component';

@Component({
  selector: 'app-display-glove',
  templateUrl: './display-glove.component.html',
  styleUrls: ['./display-glove.component.css']
})
export class DisplayGloveComponent implements OnInit {
  selectedGlove$: Observable<Glove>;
  resistances$: Observable<Resistance[][]>;


  constructor(private resistancesService: ResistancesService, private gloves: GlovesService, private route: ActivatedRoute, public auth: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.selectedGlove$ = this.route.paramMap.pipe(
      map(m => m.get('glove')),
      switchMap(gloveId => {
        console.log(gloveId)
        // If we're here, the cas number changed!
        if (history.state.data) {
          return of(history.state.data as Glove);
        } else {
          return this.gloves.getGlove(Number.parseInt(gloveId, 10));
        }
      })
    );

    this.resistances$ = this.selectedGlove$.pipe(switchMap(r => this.resistancesService.getForGlove(r.id)));
  }

  openResistanceModal(glove: Glove) {
    this.dialog.open(ResistanceModalComponent, {data: { glove }});
  }
}
