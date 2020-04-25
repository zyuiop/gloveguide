import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Substance} from '../../data/substance';
import {Solution} from '../../data/solution';
import {SolutionsService} from '../../services/solutions.service';
import {GloveResult} from '../../data/gloves';
import {ResistancesService} from '../../services/resistances.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-solution-compositor',
  templateUrl: './solution-compositor.component.html',
  styleUrls: ['./solution-compositor.component.css']
})
export class SolutionCompositorComponent implements OnInit {

  solution: Solution = new Solution();
  result: GloveResult[] = undefined;
  @Output() filterGloves = new EventEmitter<string[]>();

  constructor(private service: SolutionsService, private resistancesService: ResistancesService, private modalService: MatDialog) {
  }

  get totalProportion() {
    return this.solution.substances.map(subst => subst.proportion).reduce((prev, current) => prev + current, 0)
      + this.solution.water + this.solution.impurities;
  }

  get missingProportion() {
    return 100.0 - this.totalProportion;
  }

  open(content) {
    this.modalService.open(content);
  }

  ngOnInit(): void {
  }

  addSubstance(subst: Substance) {
    this.solution.substances.push({substance: subst, proportion: this.missingProportion});
    this.onChange();
  }

  glovesForSubstance(subst: Substance) {
    return this.resistancesService.getForSubstance(subst.id);
  }

  onChange() {
    this.result = undefined;
    if (this.totalProportion !== 100) {
      this.filterGloves.emit(undefined);
      return;
    }

    this.filterGloves.emit([]);
    this.service.searchGloves(this.solution)
      .subscribe(res => {
        this.result = res;
        this.filterGloves.emit(res.map(e => e.material));
      });
  }
}
