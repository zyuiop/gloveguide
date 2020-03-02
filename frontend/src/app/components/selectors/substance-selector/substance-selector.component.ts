import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SubstancesService} from '../../../services/substances.service';
import {Observable} from 'rxjs';
import {Substance} from '../../../data/substance';
import {FormControl} from '@angular/forms';
import {filter, map, startWith, switchMap} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {MatAutocomplete} from '@angular/material/autocomplete';

@Component({
  selector: 'app-substance-selector',
  templateUrl: './substance-selector.component.html',
  styleUrls: ['./substance-selector.component.css']
})
export class SubstanceSelectorComponent implements OnInit {

  substances: Observable<Substance[]>;
  filteredSubstances: Observable<Substance[]>;
  input = new FormControl();
  searchResults: Substance[];
  searching = false;

  @Output() selectedChange = new EventEmitter<Substance>();

  constructor(public substancesService: SubstancesService) {
  }

  get hasSelectedSubstance() {
    return isNotNullOrUndefined(this.input.value) && typeof this.input.value === 'object' && this.input.value.casNumber;
  }

  ngOnInit(): void {
    this.substances = this.substancesService.getCachedSubstances();
    this.filteredSubstances = this.input.valueChanges
      .pipe(
        startWith(''),
        filter(v => typeof v === 'string'),
        switchMap(value => this._filter(value))
      );

  }

  displaySubstance(subst: Substance): string {
    return subst && subst.casNumber && subst.name ? subst.name + ' [' + subst.casNumber + ']' : '';
  }

  search() {
    if (typeof this.input.value === 'object' && this.input.value.casNumber) {
      this.selectedChange.emit(this.input.value as Substance);
      this.reset();
    } else {
      if (this.searching) {
        return; // No two parallel searches
      }
      this.searching = true;
      this.input.disable();
      this.searchResults = undefined;

      this.substancesService
        .searchSubstances(this.input.value)
        .subscribe(substances => {
          this.searchResults = substances;
          this.searching = false;
          this.input.enable();
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
    this.input.setValue('');
    this.input.enable();
    this.searching = false;
    this.searchResults = undefined;
  }

  select(s: Substance) {
    this.selectedChange.emit(s);
    this.reset();
  }

  private _filter(value: string): Observable<Substance[]> {
    const filterValue = value.toLowerCase();

    return this.substances.pipe(map(substances =>
        substances.filter(option =>
          option.name.toLowerCase().startsWith(filterValue) || option.casNumber.toLowerCase().startsWith(filterValue)
        )
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
