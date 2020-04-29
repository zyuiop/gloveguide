import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Glove} from '../../data/gloves';
import {ResistancesService} from '../../services/resistances.service';
import {GlovesService} from '../../services/gloves.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-create-glove',
  templateUrl: './create-glove.component.html',
  styleUrls: ['./create-glove.component.css']
})
export class CreateGloveComponent implements OnInit {
  glove$: Observable<Glove>;

  constructor(private resistancesService: ResistancesService, private gloves: GlovesService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // TODO: update depending on params (create or edit)
    this.glove$ = this.route.paramMap.pipe(
      map(m => m.get('glove')),
      switchMap(gloveId => {
        if (gloveId) {
          if (history.state.data) {
            return of(history.state.data as Glove);
          } else {
            return this.gloves.getGlove(Number.parseInt(gloveId, 10));
          }
        } else {
          const glove = new Glove();
          glove.powdered = false;
          glove.fingerTextured = false;
          return of(glove);
        }
      })
    );

  }
}
