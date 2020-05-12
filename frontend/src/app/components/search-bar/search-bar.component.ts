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

import { Component, OnInit } from '@angular/core';
import {Substance} from '../../data/substance';
import {Observable} from 'rxjs';
import {ResistancesService} from '../../services/resistances.service';
import {Resistance} from '../../data/resistance';
import {Glove} from '../../data/gloves';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  selectedSubstance: Substance;
  selectedGlove: Glove;
  resistances: Resistance[][];

  constructor(private resistancesService: ResistancesService, private router: Router) { }

  ngOnInit(): void {
  }

  onSearch($event) {
    this.selectedSubstance = undefined;
    this.selectedGlove = undefined;

    if ($event?.casNumber) {
      this.router.navigate(['/', 'substances', $event.casNumber], {state: {data: $event}});
    } else if ($event?.brand) {
      this.router.navigate(['/', 'gloves', $event.id], {state: {data: $event}});
    } else if (!$event) {
      this.router.navigate(['/']);
    }
  }
}
