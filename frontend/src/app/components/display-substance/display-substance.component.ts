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
import {Substance} from '../../data/substance';
import {Resistance} from '../../data/resistance';
import {ResistancesService} from '../../services/resistances.service';
import {ActivatedRoute} from '@angular/router';
import {SubstancesService} from '../../services/substances.service';
import {map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {SolutionsService} from '../../services/solutions.service';
import {SolutionModalComponent} from '../solutions/solution-modal/solution-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-display-substance',
  templateUrl: './display-substance.component.html',
  styleUrls: ['./display-substance.component.css']
})
export class DisplaySubstanceComponent implements OnInit {
  selectedSubstance$: Observable<Substance>;
  resistances$: Observable<Resistance[][]>;

  constructor(private resistancesService: ResistancesService, private substances: SubstancesService, private route: ActivatedRoute,
              private solutions: SolutionsService, private modal: NgbModal) {
  }

  ngOnInit(): void {
    this.selectedSubstance$ = this.route.paramMap.pipe(
      map(m => m.get('casNumber')),
      switchMap(casNumber => {
        // If we're here, the cas number changed!
        if (history.state.data && history.state.data) {
          return of(history.state.data);
        } else {
          return this.substances.getSubstance(casNumber);
        }
      })
    );

    this.resistances$ = this.selectedSubstance$.pipe(switchMap(r => this.resistancesService.getForSubstance(r.id)));
  }

  addToSolution(s: Substance) {
    this.solutions.addSubstance(s);
    this.modal.open(SolutionModalComponent, {size: 'xl', centered: true});
  }
}
