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
import {Substance} from '../../../data/substance';
import {Solution} from '../../../data/solution';
import {SolutionsService} from '../../../services/solutions.service';
import {GloveResult} from '../../../data/gloves';
import {ResistancesService} from '../../../services/resistances.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-solution-compositor',
  templateUrl: './solution-compositor.component.html',
  styleUrls: ['./solution-compositor.component.css']
})
export class SolutionCompositorComponent implements OnInit {
  result: GloveResult[] = undefined;

  constructor(private service: SolutionsService, private resistancesService: ResistancesService, private modalService: MatDialog) {
  }

  get totalProportion(): number {
    return this.service.totalProportion;
  }

  get solution(): Solution {
    return this.service.solution;
  }

  open(content) {
    this.modalService.open(content);
  }

  ngOnInit(): void {
    this.onChange();
  }

  addSubstance(subst: Substance) {
    this.service.addSubstance(subst);
    this.onChange();
  }

  onChange() {
    this.result = undefined;
    if (this.service.totalProportion !== 100) {
      return;
    }

    this.service.searchGloves(this.solution)
      .subscribe(res => {
        this.result = res;
      });
  }

  reset() {
    this.service.reset();
    this.onChange();
  }
}
