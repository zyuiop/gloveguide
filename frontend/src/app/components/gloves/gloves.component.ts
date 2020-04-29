import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GlovesService} from '../../services/gloves.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Glove} from '../../data/gloves';
import {map} from 'rxjs/operators';
import {ResistancesService} from '../../services/resistances.service';

@Component({
  selector: 'app-gloves',
  templateUrl: './gloves.component.html',
  styleUrls: ['./gloves.component.css']
})
export class GlovesComponent implements OnInit, OnChanges {
  @Input() filteredTypes: string[] = undefined;
  private sub = new BehaviorSubject<Glove[]>([]);

  gloves: Observable<Glove[]>;

  constructor(private service: GlovesService, private resistances: ResistancesService) {
  }

  ngOnInit(): void {
    this.gloves = this.sub
    .pipe(
      map(gloves => {
        if (!this.filteredTypes) {
          return gloves;
        } else {
          return gloves.filter(glove => glove.material.types.some(mat => this.filteredTypes.indexOf(mat) !== -1));
        }
      })
    );

    this.service.getGloves().subscribe(res => this.sub.next(res));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filteredTypes) this.sub.next(this.sub.value);
  }

}
