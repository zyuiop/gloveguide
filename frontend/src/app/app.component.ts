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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private static CONDITIONS_ACCEPTED = 'conditions_accepted';
  private static CONDITIONS_ACCEPTED_DURATION_HOURS = 12;

  title = 'frontend';
  gloveTypes: string[] = undefined;


  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    const lastModal = localStorage.getItem(AppComponent.CONDITIONS_ACCEPTED);

    if (!lastModal || Number.parseInt(lastModal, 10) < Date.now()) {
      this.modalService.open(DisclaimerComponent, {size: 'xl', centered: true, backdrop: 'static'})
        .result.then(result => {
        if (result === true) {
          localStorage.setItem(AppComponent.CONDITIONS_ACCEPTED,
            (Date.now() + (AppComponent.CONDITIONS_ACCEPTED_DURATION_HOURS * 24 * 60 * 1000)).toString(10));
        }
      });
    }
  }
}
