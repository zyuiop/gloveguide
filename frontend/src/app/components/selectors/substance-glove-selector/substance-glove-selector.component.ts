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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SubstancesService} from '../../../services/substances.service';
import {Observable} from 'rxjs';
import {Substance} from '../../../data/substance';
import {FormControl} from '@angular/forms';
import {filter, map, startWith, switchMap} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Glove} from '../../../data/gloves';
import {GlovesService} from '../../../services/gloves.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-substance-glove-selector',
  templateUrl: './substance-glove-selector.component.html',
  styleUrls: ['./substance-glove-selector.component.css']
})
export class SubstanceGloveSelectorComponent implements OnInit, OnChanges {

  @Input() allowGloves = true;
  @Input() allowSubstances = true;
  @Input() label;
  @Input() selectionMode = false;
  @Input() disabled = false;

  substances: Observable<(Substance | Glove)[]>;
  filteredSubstances: Observable<(Substance | Glove)[]>;
  input = new FormControl();
  searchResults: Substance[];
  searching = false;

  @Input() selected;
  @Output() selectedChange = new EventEmitter<(Substance | Glove)>();

  constructor(public substancesService: SubstancesService, public gloves: GlovesService, public snack: MatSnackBar) {
  }

  get hasSelectedSubstance() {
    return isNotNullOrUndefined(this.input.value) && typeof this.input.value === 'object' &&
      ((this.allowSubstances && this.input.value.casNumber) || (this.allowGloves && this.input.value.specifications));
  }

  ngOnInit(): void {
    this.substances = this.substancesService.getCachedSubstances().pipe(
      switchMap(substances => this.gloves.getGloves().pipe(map(gloves => {
        const targetArray: (Substance | Glove)[] = [];
        substances.forEach(s => targetArray.push(s));
        gloves.forEach(g => targetArray.push(g));
        return targetArray;
      })))
    );

    this.filteredSubstances = this.input.valueChanges
      .pipe(
        startWith(''),
        filter(v => typeof v === 'string'),
        switchMap(value => this._filter(value))
      );

    if (this.disabled) {
      this.input.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selected) {
      this.input.setValue(this.selected);
    }
  }

  displaySelected(selected: any): string {
    if (!selected) {
      return '';
    } else if (selected.casNumber) {
      const subst = selected as Substance;
      return subst.name + ' [' + subst.casNumber + ']';
    } else if (selected.specifications) {
      const glove = selected as Glove;
      return glove.brand + ' ' + glove.name;
    } else {
      return '';
    }
  }

  search() {
    if (this.hasSelectedSubstance) {
      this.selectedChange.emit(this.input.value as (Substance | Glove));
      this.reset();
    } else if (this.input.value && this.input.value.length > 0 && this.allowSubstances) {
      if (this.searching) {
        return; // No two parallel searches
      }
      this.selectedChange.emit(undefined);

      this.searching = true;
      this.input.disable();
      this.searchResults = undefined;

      this.substancesService
        .searchSubstances(this.input.value)
        .subscribe(substances => {
          this.searchResults = substances;
          this.searching = false;
          if (!this.disabled) {
            this.input.enable();
          }
        }, err => {
          this.searching = false;
          if (!this.disabled) {
            this.input.enable();
          }
          this.snack.open(err, 'Retry', {duration: 5000})
            .onAction()
            .subscribe(_ => this.search());
        });
      console.log('Searching ' + this.input.value);
    }
  }

  keypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  reset() {
    if (!this.selectionMode) {
      this.input.setValue('');
    }
    if (!this.disabled) {
      this.input.enable();
    }
    this.searching = false;
    this.searchResults = undefined;
  }

  select(s: Substance) {
    this.selectedChange.emit(s);
    this.reset();
  }

  private _filter(value: string): Observable<(Substance | Glove)[]> {
    let filterValue = value.toLowerCase();
    const parts = filterValue.split(':');
    const onlyGloves = parts[0].toLowerCase() === 'gloves' || parts[0].toLowerCase() === 'glove';
    filterValue = onlyGloves ? (parts.length > 1 ? parts[1].trim() : '') : filterValue;

    console.log('Filter: ' + filterValue + ', only gloves:' + onlyGloves);

    return this.substances.pipe(map(substances =>
        substances.filter(_opt => {
          const option = _opt as any;
          if (option.casNumber) {
            const opt = option as Substance;
            return !onlyGloves && this.allowSubstances && (opt.name.toLowerCase().startsWith(filterValue) || opt.casNumber.toLowerCase().startsWith(filterValue));
          } else if (option.brand) {
            const opt = option as Glove;
            const name = opt.brand + ' ' + opt.name;
            return this.allowGloves && (name.toLowerCase().startsWith(filterValue) || opt.reference.startsWith(filterValue) || opt.materials.filter(e => e.toLowerCase().startsWith(filterValue)).length > 0);
          } else {
            return false;
          }
        })
      ),
      map(arr => {
        if (arr.length > 50) {
          // Don't return a list of more than 50 items, to avoid lag
          return [];
        } else {
          return arr;
        }
      })
    );
  }
}
