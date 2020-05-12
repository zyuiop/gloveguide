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

import {Component, Input, OnInit} from '@angular/core';
import {SolutionsService} from '../../../services/solutions.service';
import {GloveResult} from '../../../data/gloves';

@Component({
  selector: 'app-solution-results',
  templateUrl: './solution-results.component.html',
  styleUrls: ['./solution-results.component.css']
})
export class SolutionResultsComponent implements OnInit {
  @Input() result: GloveResult[] = undefined;

  constructor(private service: SolutionsService) {
  }

  get gloveTypes() {
    return this.result.map(g => g.material);
  }

  get solution() {
    return this.service.solution;
  }

  ngOnInit(): void {
  }

}
