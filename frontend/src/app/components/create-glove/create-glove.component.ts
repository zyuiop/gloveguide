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
import {Glove, GloveGlassHandling, GloveMaterials, GloveTractionResistance} from '../../data/gloves';
import {ResistancesService} from '../../services/resistances.service';
import {GlovesService} from '../../services/gloves.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-glove',
  templateUrl: './create-glove.component.html',
  styleUrls: ['./create-glove.component.css']
})
export class CreateGloveComponent implements OnInit {
  glove$: Observable<Glove>;
  GloveMaterials = GloveMaterials;
  saving = false;

  constructor(private resistancesService: ResistancesService, private gloves: GlovesService, private route: ActivatedRoute,
              private router: Router, private toast: MatSnackBar) {
  }

  ngOnInit(): void {
    // TODO: update depending on params (create or edit)
    this.glove$ = this.route.paramMap.pipe(
      map(m => m.get('glove')),
      switchMap(gloveId => {
        if (gloveId) {
          // Download the glove every time to avoid updated data to poison local cache
          return this.gloves.loadGlove(Number.parseInt(gloveId, 10));
        } else {
          const glove = new Glove();
          glove.powdered = false;
          glove.fingerTextured = false;
          glove.tractionResistance = [new GloveTractionResistance()];
          glove.glassHandling = [new GloveGlassHandling()];
          return of(glove);
        }
      })
    );

  }

  save(glove: Glove) {
    if (this.saving) {
      return;
    }
    this.saving = true;

    if (glove.id && glove.id !== 0) {
      this.gloves.updateGlove(glove.id, glove).subscribe(result => {
        this.toast.open('Glove updated!', undefined, {duration: 2000});
        this.router.navigate(['/', 'gloves', glove.id]);
      }, err => {
        this.toast.open('An error occured, please retry.', undefined, {duration: 2000});
        this.saving = false;
      });
    } else {
      glove.id = 0;
      this.gloves.createGlove(glove).subscribe(result => {
        this.toast.open('Glove created', undefined, {duration: 2000});
        this.router.navigate(['/', 'gloves', result.id], {state: {data: result}});
      }, err => {
        this.toast.open('An error occured, please retry.', undefined, {duration: 2000});
        glove.id = undefined;
        this.saving = false;
      });
    }
  }

  addTractionResistance(glove: Glove) {
    glove.tractionResistance.push(new GloveTractionResistance());
  }

  addGlassHandling(glove: Glove) {
    glove.glassHandling.push(new GloveGlassHandling());
  }

  deleteTractionResistance(glove: Glove, res: GloveTractionResistance) {
    glove.tractionResistance.splice(glove.tractionResistance.indexOf(res), 1);
  }

  deleteGlassHandling(glove: Glove, res: GloveGlassHandling) {
    glove.glassHandling.splice(glove.glassHandling.indexOf(res), 1);
  }
}
