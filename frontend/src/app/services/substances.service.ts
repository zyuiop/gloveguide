import {BehaviorSubject, Observable} from 'rxjs';
import {Substance} from '../data/substance';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class SubstancesService {
  private nextRefresh = 0;
  private cacheSubject = new BehaviorSubject<Substance[]>([]);

  constructor(private http: HttpClient) {
  }

  getSubstances(): Observable<Substance[]> {
    return this.http.get<Substance[]>(environment.backendUrl + '/substances');
  }

  searchSubstances(query: string): Observable<Substance[]> {
    return this.http.get<Substance[]>(environment.backendUrl + '/substances/search/' + query);
  }

  updateCachedSubstances() {
    this.getSubstances().subscribe(res => this.cacheSubject.next(res));
  }

  getCachedSubstances(): Observable<Substance[]> {
    if (this.nextRefresh < Date.now()) {
      this.nextRefresh = Date.now() + 10 * 60 * 1000;
      this.updateCachedSubstances();
    }
    return this.cacheSubject;
  }

}
