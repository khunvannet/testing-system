import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface TestCase {
  id: number;
  code: string;
  name: string;
  description: string;
  notes?: string;
  attachment?: string;
  mainId?: number;
  statusId?: number;
  resultId?: number;
}

export interface TestRun {
  id: number;
  code: string;
  name: string;
  description: string;
  projectId: number;
  active: boolean;
  testCases: TestCase[];
}
@Injectable({
  providedIn: 'root',
})
export class TestRunService {
  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:8080/api/test/run';

  getTestRun(): Observable<TestRun[]> {
    return this.http.get<TestRun[]>(this.url);
  }
  getTestRunById(id: number): Observable<TestRun> {
    return this.http.get<TestRun>(`${this.url}/${id}`);
  }
  addTestRun(testrun: TestRun): Observable<TestRun> {
    return this.http.post<TestRun>(this.url, testrun);
  }
}
