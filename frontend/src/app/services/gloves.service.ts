import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Glove} from '../data/gloves';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class GlovesService {
  private nextRefresh = 0;
  private cacheSubject = new BehaviorSubject<Glove[]>([]);

  constructor(private http: HttpClient) {
  }

  pullGloves(): Observable<Glove[]> {
    return this.http.get<Glove[]>(environment.backendUrl + '/gloves');
  }

  updateCachedGloves() {
    this.pullGloves().subscribe(res => this.cacheSubject.next(res))
  }

  getGloves(): Observable<Glove[]> {
    if (this.nextRefresh < Date.now()) {
      this.nextRefresh = Date.now() + 10 * 60 * 1000;
      this.updateCachedGloves();
    }
    return this.cacheSubject;
  }
}
