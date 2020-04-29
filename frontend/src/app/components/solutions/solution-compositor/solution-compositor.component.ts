import {Component, OnInit} from '@angular/core';
import {Substance} from '../../../data/substance';
import {Solution} from '../../../data/solution';
import {SolutionsService} from '../../../services/solutions.service';
import {GloveResult} from '../../../data/gloves';
import {ResistancesService} from '../../../services/resistances.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-solution-compositor',
  templateUrl: './solution-compositor.component.html',
  styleUrls: ['./solution-compositor.component.css']
})
export class SolutionCompositorComponent implements OnInit {
  result: GloveResult[] = undefined;

  constructor(private service: SolutionsService, private resistancesService: ResistancesService, private modalService: MatDialog) {
  }

  get totalProportion(): number {
    return this.service.totalProportion;
  }

  get solution(): Solution {
    return this.service.solution;
  }

  open(content) {
    this.modalService.open(content);
  }

  ngOnInit(): void {
    this.onChange();
  }

  addSubstance(subst: Substance) {
    this.service.addSubstance(subst);
    this.onChange();
  }

  onChange() {
    this.result = undefined;
    if (this.service.totalProportion !== 100) {
      return;
    }

    this.service.searchGloves(this.solution)
      .subscribe(res => {
        this.result = res;
      });
  }

  reset() {
    this.service.reset();
    this.onChange();
  }
}
