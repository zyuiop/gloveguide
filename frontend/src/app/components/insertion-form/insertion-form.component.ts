import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Substance} from '../../data/substance';
import {SubstancesService} from '../../services/substances.service';
import {Glove} from '../../data/gloves';
import {GlovesService} from '../../services/gloves.service';
import {Resistance} from '../../data/resistance';
import {ResistancesService} from '../../services/resistances.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-insertion-form',
  templateUrl: './insertion-form.component.html',
  styleUrls: ['./insertion-form.component.css']
})
export class InsertionFormComponent implements OnInit {
  separator: string;
  errors: string[] = [];
  private substances = new BehaviorSubject<Map<string, Substance>>(new Map());
  private gloves = new BehaviorSubject<Map<string, Glove>>(new Map());
  textarea: string = '';

  result: Resistance[][] = [];
  inserting: boolean = false;

  constructor(private substancesService: SubstancesService, private glovesService: GlovesService, private resistancesService: ResistancesService) {
  }

  ngOnInit(): void {
    this.substancesService.getCachedSubstances().subscribe(subst => {
      const map = new Map<string, Substance>();
      subst.forEach(s => map.set(s.casNumber, s));
      this.substances.next(map);
    });
    this.glovesService.getGloves().subscribe(gloves => {
      const map = new Map<string, Glove>();
      gloves.forEach(g => map.set(g.reference, g));
      this.gloves.next(map);
    });
  }

  contentChange($event: string) {
    this.textarea = $event;
    const lines = $event?.split('\n');
    this.errors = [];
    // Is it CSV or TSV?
    if (lines && lines.length > 0) {
      this.separator = lines[0].includes('\t') ? '\t' : ',';
      const table: string[][] = lines.map(line => line.trim()).filter(line => line.length > 0).map(line => line.split(this.separator));
      // Split the lines

      const gloves = table[0].map((gloveId, index) => {
        if (index < 2) return null; // ignore two first columns

        const glove = this.gloves.value.get(gloveId.trim());

        if (!glove) this.errors.push('Line 1, col ' + index + ': unknown glove reference "' + gloveId + '"');

        return glove;
      });

      this.result = table.filter((_, index) => index > 0).map((line, index) => {
        const casNumber = line[0];
        const concentration = Number.parseInt(line[1].replace('%', '').trim(), 10);

        const substance = this.substances.value.get(casNumber);

        if (isNaN(concentration)) {
          this.errors.push('Line ' + (index + 1) + ': cannot parse concentration "' + line[1] + '" (not a number) ' + line.join(','));
        }
        if (substance === null || substance === undefined) {
          this.errors.push('Line ' + (index + 1) + ': unknown substance with CAS number "' + casNumber + '"');
        }
        const res: Resistance[] = [];

        console.log(line);

        for (let i = 2; i < line.length; ++i) {
          const minMax = this.parseResistance(line[i]);

          if (!minMax) this.errors.push('Line ' + (index + 1) + ', col ' + (i + 1) + ': cannot parse resistance "' + line[i] + '"');
          res.push({glove: gloves[i], concentration, substance, min: minMax[0], max: minMax[1]});
        }

        return res;
      });
    }
  }

  private parseResistance(_resistance: string): number[] {
    const resistance = _resistance.trim().replace(' ', '');
    const ht = />([0-9]+)'?/.exec(resistance);
    const lt = /<([0-9]+)'?/.exec(resistance);
    const interval = /([0-9]+)'?-([0-9]+)'?/.exec(resistance);
    const fixed = /([0-9]+)'?/.exec(resistance);

    if (ht) {
      return [Number.parseInt(ht[1], 10), 0];
    } else if (lt) {
      return [0, Number.parseInt(lt[1], 10)];
    } else if (interval) {
      return [Number.parseInt(interval[1], 10), Number.parseInt(interval[2], 10)];
    } else if (fixed) {
      return [Number.parseInt(fixed[1], 10), Number.parseInt(fixed[1], 10)];
    } else if (resistance === '' || resistance === '/') {
      return [null, null];
    } else if (resistance.startsWith('Retrait') || resistance.startsWith('Immediate')) {
      return [0, -1]; // "imminent retreat"
    } else {
      return undefined;
    }
  }

  insert() {
    if (this.inserting || this.errors.length > 0 || this.result.length < 1) {
      return;
    }
    this.inserting = true;

    this.resistancesService.insertGloveResistance(this.result)
      .subscribe(ok => {
        Swal.fire('Ok', 'The resistances have been inserted/updated!', 'success');
        this.inserting = false;
        this.result = [];
        this.textarea = '';
      }, err => {
        this.inserting = false;
        console.log(err);
        Swal.fire('Uh oh', 'An error occurred while updating/inserting... Please try again later. (Code: ' + err.status + ' ' + err.statusText + ')', 'error');
      });
  }
}
