import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SolutionsService} from '../../../services/solutions.service';
import {Solution} from '../../../data/solution';

@Component({
  selector: 'app-solution-viewer',
  templateUrl: './solution-viewer.component.html',
  styleUrls: ['./solution-viewer.component.css']
})
export class SolutionViewerComponent implements OnInit {
  @Output() changes = new EventEmitter();

  constructor(private service: SolutionsService) {
  }

  get solution(): Solution {
    return this.service.solution;
  }

  ngOnInit(): void {
  }

  onChange() {
    this.changes.emit();
  }
}
