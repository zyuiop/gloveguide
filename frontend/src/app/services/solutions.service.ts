import {BehaviorSubject, Observable} from 'rxjs';
import {Substance} from '../data/substance';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Solution} from '../data/solution';
import {GloveResult} from '../data/gloves';

@Injectable({providedIn: 'root'})
export class SolutionsService {
  constructor(private http: HttpClient) {
  }

  searchGloves(solution: Solution): Observable<GloveResult[]> {
    return this.http.post<GloveResult[]>(environment.backendUrl + '/solutions/compute', solution);
  }

}
