import {Component, OnInit} from '@angular/core';
import {Resistance} from '../../data/resistance';
import {ResistancesService} from '../../services/resistances.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Glove} from '../../data/gloves';
import {GlovesService} from '../../services/gloves.service';

@Component({
  selector: 'app-display-glove',
  templateUrl: './display-glove.component.html',
  styleUrls: ['./display-glove.component.css']
})
export class DisplayGloveComponent implements OnInit {
  selectedGlove$: Observable<Glove>;
  resistances$: Observable<Resistance[][]>;


  constructor(private resistancesService: ResistancesService, private gloves: GlovesService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.selectedGlove$ = this.route.paramMap.pipe(
      map(m => m.get('glove')),
      switchMap(gloveId => {
        // If we're here, the cas number changed!
        if (history.state.data) {
          return of(history.state.data as Glove);
        } else {
          return this.gloves.getGlove(Number.parseInt(gloveId, 10));
        }
      })
    );

    this.resistances$ = this.selectedGlove$.pipe(switchMap(r => this.resistancesService.getForGlove(r.id)));
  }

}
