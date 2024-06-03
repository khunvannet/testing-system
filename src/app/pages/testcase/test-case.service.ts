import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
export interface TestCase {
  id: string;
  code: number;
  title: string;
  description: string;
  owner: string;
  note: string;
  attachment: string;
  result: Result[];
}

export interface Result {
  id: number;
  status: string;
}
@Injectable({
  providedIn: 'root',
})
export class TestCaseService {
  constructor(private http: HttpClient) {}

  _url: string = '../../../assets/data/testcase.json';

  getTesteCase(): Observable<TestCase[]> {
    return this.http
      .get<TestCase[]>(this._url)
      .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server error');
  }
}
