import {Component, Input, OnInit} from '@angular/core';
import {SolutionsService} from '../../../services/solutions.service';
import {GloveResult} from '../../../data/gloves';

@Component({
  selector: 'app-solution-results',
  templateUrl: './solution-results.component.html',
  styleUrls: ['./solution-results.component.css']
})
export class SolutionResultsComponent implements OnInit {
  @Input() result: GloveResult[] = undefined;

  constructor(private service: SolutionsService) {
  }

  get gloveTypes() {
    return this.result.map(g => g.material);
  }

  get solution() {
    return this.service.solution;
  }

  ngOnInit(): void {
  }

}
