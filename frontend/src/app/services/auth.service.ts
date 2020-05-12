import {Injectable} from '@angular/core';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private KEY = 'password';

  constructor(private http: HttpClient) {
  }

  isLoggedIn() {
    return isNotNullOrUndefined(sessionStorage.getItem(this.KEY));
  }

  tryLogin(password: string): Observable<any> {
    return this.http.get(environment.backendUrl + '/login/check', {headers: {Authorization: password}})
      .pipe(
        tap(success => sessionStorage.setItem(this.KEY, password))
      );
  }

  logout() {
    sessionStorage.removeItem(this.KEY);
  }

  get header() {
    return sessionStorage.getItem(this.KEY);
  }
}
