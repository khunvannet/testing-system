import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TestCase } from '../testcase/test-case.service';

export interface TestRun {
  id?: number;
  code?: string;
  name: string;
  description?: string;
  projectId: number;
  active: boolean;
  testCases: any[];
}

@Injectable({
  providedIn: 'root',
})
export class TestRunService {
  private url: string = 'http://127.0.0.1:8000/api/test/run';

  constructor(private http: HttpClient) {}

  getTestRun(): Observable<TestRun[]> {
    return this.http.get<TestRun[]>(this.url);
  }

  getTestRunById(id: number): Observable<TestRun> {
    return this.http.get<TestRun>(`${this.url}/${id}`);
  }

  addTestRun(testRun: TestRun): Observable<TestRun> {
    return this.http.post<TestRun>(this.url, testRun);
  }
  editTestRun(id: number, testRun: TestRun): Observable<TestRun> {
    return this.http.put<TestRun>(`${this.url}/${id}`, testRun);
  }
}
