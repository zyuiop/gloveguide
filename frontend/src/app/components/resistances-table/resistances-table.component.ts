import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Resistance, resistanceToClass, resistanceToString, sortResistances} from '../../data/resistance';

@Component({
  selector: 'app-resistances-table',
  templateUrl: './resistances-table.component.html',
  styleUrls: ['./resistances-table.component.css']
})
export class ResistancesTableComponent implements OnInit, OnChanges {
  @Input() resistances: Resistance[][] = [];
  @Input() display: boolean = true;
  @Input() showIfEmpty: boolean = false;
  @Input() transpose: boolean = false;

  resistanceToClass = resistanceToClass;
  resistanceToString = resistanceToString;

  substance(row: Resistance[]) {
    return row[0]?.substance?.name + ' (CAS ' + row[0]?.substance?.casNumber + ') ' + row[0]?.concentration + '%';
  }
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.resistances || changes.transpose)) {
      if (this.transpose === true) {
        this.resistances = this.resistances.map(r => r.sort(sortResistances));
      } else if (this.resistances.length > 0 && this.resistances[0].length === 1) {
        // Only one glove - sort!
        this.resistances = this.resistances.sort((r1, r2) => sortResistances(r1[0], r2[0]));
      }
    }
  }

}
