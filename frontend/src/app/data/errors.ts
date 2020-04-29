import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

export function handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
    return throwError('Client error. Please try again later.');
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);

    try {
      const body = error.message ? error.message : error.statusText;
      return throwError('Server error: ' + body);
    } catch (e) {
      console.error('An error occurred while processing the error', e);
      return throwError('Server error: ' + error.status + ' ' + error.statusText);
    }
  }
}
