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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rating, Ratings, strToRating} from '../../../data/rating';

@Component({
  selector: 'app-rating-selector',
  templateUrl: './rating-selector.component.html',
  styleUrls: ['./rating-selector.component.css']
})
export class RatingSelectorComponent implements OnInit {
  Ratings = Ratings;
  strToRating = strToRating;
  @Input() selected: Rating;
  @Input() label: string;
  @Input() name: string;
  @Output() selectedChange = new EventEmitter<Rating>()

  constructor() { }

  ngOnInit(): void {
  }

  onChange($event: Rating) {
    this.selectedChange.emit($event);
  }
}
