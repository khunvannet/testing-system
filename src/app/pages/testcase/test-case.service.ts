import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TestCase {
  id: number;
  code: number;
  name: string;
  description: string;
  notes: string;
  attachment: string;
  mainId: number;
}

@Injectable({
  providedIn: 'root',
})
export class TestCaseService {
  private url: string = 'http://localhost:8080/api/test';
  dataChanged: any;

  constructor(private http: HttpClient) {}

  getTest(): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(this.url);
  }

  getTestByMainId(mainId: number): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(`${this.url}/main/${mainId}`);
  }

  addTest(test: TestCase): Observable<TestCase> {
    return this.http.post<TestCase>(this.url, test);
  }
  editTest(id: number, test: TestCase): Observable<TestCase> {
    return this.http.put<TestCase>(`${this.url}/${id}`, test);
  }
  deleteTest(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
