import { Component } from '@angular/core';
import {SubstancesService} from './services/substances.service';
import {Substance} from './data/substance';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  selectedSubstances: Substance[] = [];
}
