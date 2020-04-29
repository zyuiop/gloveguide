import {BehaviorSubject, Observable} from 'rxjs';
import {Substance} from '../data/substance';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {handleError} from '../data/errors';

@Injectable({providedIn: 'root'})
export class SubstancesService {
  private nextRefresh = 0;
  private cacheSubject = new BehaviorSubject<Substance[]>([]);

  constructor(private http: HttpClient) {
  }

  getSubstances(): Observable<Substance[]> {
    return this.http.get<Substance[]>(environment.backendUrl + '/substances')
      .pipe(catchError(handleError));
  }

  getSubstance(casNumber: string): Observable<Substance> {
    return this.http.get<Substance>(environment.backendUrl + '/substances/' + casNumber)
      .pipe(catchError(handleError));
  }

  searchSubstances(query: string): Observable<Substance[]> {
    return this.http.get<Substance[]>(environment.backendUrl + '/substances/search/' + query)
      .pipe(catchError(handleError));
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
