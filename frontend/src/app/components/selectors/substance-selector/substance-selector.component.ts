import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SubstancesService} from '../../../services/substances.service';
import {Observable} from 'rxjs';
import {Substance} from '../../../data/substance';
import {FormControl} from '@angular/forms';
import {filter, map, startWith, switchMap} from 'rxjs/operators';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {Glove} from '../../../data/gloves';
import {GlovesService} from '../../../services/gloves.service';

@Component({
  selector: 'app-substance-selector',
  templateUrl: './substance-selector.component.html',
  styleUrls: ['./substance-selector.component.css']
})
export class SubstanceSelectorComponent implements OnInit {

  @Input() allowGloves: boolean = true;

  substances: Observable<(Substance | Glove)[]>;
  filteredSubstances: Observable<(Substance | Glove)[]>;
  input = new FormControl();
  searchResults: Substance[];
  searching = false;

  @Output() selectedChange = new EventEmitter<(Substance | Glove)>();

  constructor(public substancesService: SubstancesService, public gloves: GlovesService) {
  }

  get hasSelectedSubstance() {
    return isNotNullOrUndefined(this.input.value) && typeof this.input.value === 'object' &&
      (this.input.value.casNumber || (this.allowGloves && this.input.value.standardResistance));
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
  }

  displaySubstance(subst: Substance): string {
    return subst && subst.casNumber && subst.name ? subst.name + ' [' + subst.casNumber + ']' : '';
  }

  search() {
    if (this.hasSelectedSubstance) {
      this.selectedChange.emit(this.input.value as (Substance | Glove));
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

  private _filter(value: string): Observable<(Substance | Glove)[]> {
    const filterValue = value.toLowerCase();

    return this.substances.pipe(map(substances =>
        substances.filter(_opt => {
          const option = _opt as any;
          if (option.casNumber) {
            const opt = option as Substance;
            return opt.name.toLowerCase().startsWith(filterValue) || opt.casNumber.toLowerCase().startsWith(filterValue);
          } else if (option.manufacturer) {
            const opt = option as Glove;
            const name = opt.manufacturer.name + ' ' + opt.name;
            return this.allowGloves && (name.toLowerCase().startsWith(filterValue) || opt.reference.startsWith(filterValue));
          } else return false;
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
