import { Component, OnInit } from '@angular/core';
import {Substance} from '../../data/substance';
import {Observable} from 'rxjs';
import {ResistancesService} from '../../services/resistances.service';
import {Resistance} from '../../data/resistance';
import {Glove} from '../../data/gloves';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  selectedSubstance: Substance;
  selectedGlove: Glove;
  resistances: Resistance[][];

  constructor(private resistancesService: ResistancesService) { }

  ngOnInit(): void {
  }

  onSearch($event) {
    this.selectedSubstance = undefined;
    this.selectedGlove = undefined;

    if ($event.casNumber) {
      this.selectedSubstance = $event;
      this.resistances = undefined;
      this.resistancesService.getForSubstance(this.selectedSubstance.id).subscribe(res => this.resistances = res);
    } else if ($event.manufacturer) {
      this.selectedGlove = $event;
      this.resistances = undefined;
      this.resistancesService.getForGlove(this.selectedGlove.id).subscribe(res => this.resistances = res);
    }
  }
}
