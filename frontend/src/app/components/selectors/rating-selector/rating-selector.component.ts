import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rating, Ratings, strToRating} from '../../../data/rating';

@Component({
  selector: 'app-rating-selector',
  templateUrl: './rating-selector.component.html',
  styleUrls: ['./rating-selector.component.css']
})
export class RatingSelectorComponent implements OnInit {
  Ratings = Ratings;
  strToRating = strToRating;
  @Input() selected: Rating;
  @Input() label: string;
  @Input() name: string;
  @Output() selectedChange = new EventEmitter<Rating>()

  constructor() { }

  ngOnInit(): void {
  }

  onChange($event: Rating) {
    this.selectedChange.emit($event);
  }
}
