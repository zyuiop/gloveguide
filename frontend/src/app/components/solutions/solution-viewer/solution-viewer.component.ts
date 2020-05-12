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

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SolutionsService} from '../../../services/solutions.service';
import {Solution} from '../../../data/solution';

@Component({
  selector: 'app-solution-viewer',
  templateUrl: './solution-viewer.component.html',
  styleUrls: ['./solution-viewer.component.css']
})
export class SolutionViewerComponent implements OnInit {
  @Output() changes = new EventEmitter();

  constructor(private service: SolutionsService) {
  }

  get solution(): Solution {
    return this.service.solution;
  }

  ngOnInit(): void {
  }

  onChange() {
    this.changes.emit();
  }
}
