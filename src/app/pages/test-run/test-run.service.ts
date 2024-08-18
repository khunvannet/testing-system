import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TestRun {
  id: number;
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
  private url_exists = 'http://127.0.0.1:8000/api/test/run/isExist';
  private url_close = 'http://127.0.0.1:8000/api/test/run/close';
  private url_active = 'http://127.0.0.1:8000/api/test/run/active';
  constructor(private http: HttpClient) {}

  getTestRun(
    pageIndex: number,
    pageSize: number,
    searchQuery: string,
    projectId: number | null
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('searchQuery', searchQuery.toString())
      .set('projectId', projectId ? projectId.toString() : '');
    return this.http.get<any>(this.url, { params });
  }

  addTestRun(testRun: TestRun): Observable<TestRun> {
    return this.http.post<TestRun>(this.url, testRun);
  }

  editTestRun(id: number, testRun: TestRun): Observable<TestRun> {
    return this.http.put<TestRun>(`${this.url}/${id}`, testRun);
  }

  isExists(name: string): Observable<{ exists: boolean }> {
    const params = new HttpParams().set('name', name);
    return this.http.get<{ exists: boolean }>(this.url_exists, { params });
  }

  getCloseRun(
    pageIndex: number,
    pageSize: number,
    searchQuery: string,
    projectId: number | null
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('searchQuery', searchQuery.toString())
      .set('projectId', projectId ? projectId.toString() : '');
    return this.http.get<any>(this.url_close, { params });
  }
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  closeRun(id: number): Observable<any> {
    return this.http.post(`${this.url_close}/${id}`, {});
  }
  activeRun(id: number): Observable<any> {
    return this.http.post(`${this.url_active}/${id}`, {});
  }
}
