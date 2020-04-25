import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Glove} from '../data/gloves';
import {Resistance} from '../data/resistance';
import {GlovesService} from './gloves.service';
import {SubstancesService} from './substances.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {Substance} from '../data/substance';

@Injectable({providedIn: 'root'})
export class ResistancesService {
  private nextRefresh = 0;
  private cacheSubject = new BehaviorSubject<Resistance[][]>([]);

  constructor(private http: HttpClient, private gloves: GlovesService, private substances: SubstancesService) {
  }

  pull(): Observable<Resistance[][]> {
    return this.transform(this.http.get<ResistanceRow[]>(environment.backendUrl + '/resistances'));
  }

  pullForGlove(glove: number): Observable<Resistance[][]> {
    return this.transform(this.http.get<ResistanceRow[]>(environment.backendUrl + '/resistances/forGlove/' + glove));
  }

  pullForSubstance(substance: number): Observable<Resistance[][]> {
    return this.transform(this.http.get<ResistanceRow[]>(environment.backendUrl + '/resistances/forSubstance/' + substance));
  }

  update() {
    this.pull().subscribe(res => this.cacheSubject.next(res));
  }

  get(): Observable<Resistance[][]> {
    if (this.nextRefresh < Date.now()) {
      this.nextRefresh = Date.now() + 10 * 60 * 1000;
      this.update();
    }
    return this.cacheSubject;
  }

  getForGlove(glove: number) {
    return this.get().pipe(map(table => table.map(row => row.filter(cell => cell.glove.id === glove))));
  }

  getForSubstance(substance: number) {
    return this.get().pipe(map(table => table.filter(row => row[0].substance.id === substance)));
  }

  insertGloveResistance(resistances: Resistance[][]): Observable<any> {
    return this.http.post(environment.backendUrl + '/resistances', resistances.map(r => {
      const cols = r.map(c => {
        return {glove: c.glove.id, min: c.min, max: c.max, remarks: c.remarks};
      });

      return {substance: r[0].substance.id, concentration: r[0].concentration, data: cols};
    }));
  }

  private transform(src: Observable<ResistanceRow[]>): Observable<Resistance[][]> {
    return src.pipe(
      switchMap(rows => {
          return this.gloves.getGloves().pipe(
            switchMap(gloves => {
              const glovesMap = new Map<number, Glove>();
              gloves.forEach(glove => glovesMap.set(glove.id, glove));

              return this.substances.getCachedSubstances().pipe(
                map(substances => {
                  const substMap = new Map<number, Substance>();
                  substances.forEach(s => substMap.set(s.id, s));

                  console.log(rows);

                  // Build the resistances array
                  return rows.map(row => {
                    const substance = substMap.get(row.substance);
                    return row.data.map(cell => {
                      return {
                        substance,
                        glove: glovesMap.get(cell.glove),
                        concentration: row.concentration,
                        min: cell.min,
                        max: cell.max,
                        remarks: cell.remarks
                      };
                    });
                  });
                })
              );
            })
          );
        }
      ), tap(res => console.log(res))
    );
  }

}

class ResistanceRow {
  substance: number;
  concentration: number;
  data: ResistanceCell[];
}

class ResistanceCell {
  glove: number;
  min?: number;
  max?: number;
  remarks?: string;
}
