import {Component, Input, OnInit} from '@angular/core';
import {Rating, strToRating} from '../../../data/rating';

@Component({
  selector: 'app-rating-badge',
  templateUrl: './rating-badge.component.html',
  styleUrls: ['./rating-badge.component.css']
})
export class RatingBadgeComponent implements OnInit {
  @Input() rating: Rating | string;

  Rating = Rating;
  strToRating = strToRating;

  constructor() {
  }

  ngOnInit(): void {
  }

}
