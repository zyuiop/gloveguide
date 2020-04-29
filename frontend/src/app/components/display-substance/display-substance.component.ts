import {Component, OnInit} from '@angular/core';
import {Substance} from '../../data/substance';
import {Resistance} from '../../data/resistance';
import {ResistancesService} from '../../services/resistances.service';
import {ActivatedRoute} from '@angular/router';
import {SubstancesService} from '../../services/substances.service';
import {map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {SolutionsService} from '../../services/solutions.service';
import {SolutionModalComponent} from '../solutions/solution-modal/solution-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-display-substance',
  templateUrl: './display-substance.component.html',
  styleUrls: ['./display-substance.component.css']
})
export class DisplaySubstanceComponent implements OnInit {
  selectedSubstance$: Observable<Substance>;
  resistances$: Observable<Resistance[][]>;

  constructor(private resistancesService: ResistancesService, private substances: SubstancesService, private route: ActivatedRoute,
              private solutions: SolutionsService, private modal: NgbModal) {
  }

  ngOnInit(): void {
    this.selectedSubstance$ = this.route.paramMap.pipe(
      map(m => m.get('casNumber')),
      switchMap(casNumber => {
        // If we're here, the cas number changed!
        if (history.state.data && history.state.data) {
          return of(history.state.data);
        } else {
          return this.substances.getSubstance(casNumber);
        }
      })
    );

    this.resistances$ = this.selectedSubstance$.pipe(switchMap(r => this.resistancesService.getForSubstance(r.id)));
  }

  addToSolution(s: Substance) {
    this.solutions.addSubstance(s);
    this.modal.open(SolutionModalComponent, {size: 'xl', centered: true});
  }
}
