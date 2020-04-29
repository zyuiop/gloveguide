import { Component, OnInit } from '@angular/core';
import {Substance} from '../../data/substance';
import {Observable} from 'rxjs';
import {ResistancesService} from '../../services/resistances.service';
import {Resistance} from '../../data/resistance';
import {Glove} from '../../data/gloves';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  selectedSubstance: Substance;
  selectedGlove: Glove;
  resistances: Resistance[][];

  constructor(private resistancesService: ResistancesService, private router: Router) { }

  ngOnInit(): void {
  }

  onSearch($event) {
    this.selectedSubstance = undefined;
    this.selectedGlove = undefined;

    if ($event?.casNumber) {
      this.router.navigate(['/', 'substances', $event.casNumber], {state: {data: $event}});
    } else if ($event?.brand) {
      this.router.navigate(['/', 'gloves', $event.id], {state: {data: $event}});
    } else if (!$event) {
      this.router.navigate(['/']);
    }
  }
}
