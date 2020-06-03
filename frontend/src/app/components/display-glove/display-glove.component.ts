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
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Glove} from '../../data/gloves';
import {GlovesService} from '../../services/gloves.service';
import {AuthService} from '../../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ResistanceModalComponent} from '../resistance-modal/resistance-modal.component';
import Swal from 'sweetalert2';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-display-glove',
  templateUrl: './display-glove.component.html',
  styleUrls: ['./display-glove.component.css']
})
export class DisplayGloveComponent implements OnInit {
  selectedGlove$: Observable<Glove>;
  resistances$: Observable<Resistance[][]>;


  constructor(private resistancesService: ResistancesService, private gloves: GlovesService, private route: ActivatedRoute, public auth: AuthService,
              private dialog: MatDialog, private snack: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
    this.selectedGlove$ = this.route.paramMap.pipe(
      map(m => m.get('glove')),
      switchMap(gloveId => {
        console.log(gloveId);
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
    this.dialog.open(ResistanceModalComponent, {data: {glove}});
  }

  deleteGlove(glove: Glove) {
    const name = glove.reference;

    Swal.fire({
      input: 'text',
      inputValidator: (inputValue: string) => {
        return (!inputValue || inputValue !== name) && 'Please type in the required text';
      },
      titleText: 'Confirm this action',
      html: 'You are about to delete this glove with all its resistance data. If that is indeed what you want to do, ' +
        'type <b>' + name + '</b> in the box below.',
      showConfirmButton: true,
      showCancelButton: true
    }).then(result => {
      if (result && result.value && result.value === name) {
        this.gloves.deleteGlove(glove.id).subscribe(res => {
          this.snack.open('Glove deleted successfully.', 'Ok');
          this.router.navigate(['/']);
        }, err => {
          console.log(err);
          this.snack.open('An error occured while deleting. Please try again later.', 'Ok');
        });
      }
    });
  }
}
