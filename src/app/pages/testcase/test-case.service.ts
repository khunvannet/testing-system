import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TestCase {
  id: number;
  code: string;
  name: string;
  description: string;
  notes?: string;
  attachment?: string;
  mainId: number;
  statusId?: number;
  resultId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TestCaseService {
  private url: string = 'http://127.0.0.1:8000/api/test';
  private select_tree: string = 'http://127.0.0.1:8000/api/selectTree';

  constructor(private http: HttpClient) {}

  getTest(
    pageIndex: number,
    pageSize: number,
    searchQuery: string,
    mainId: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('searchQuery', searchQuery.toString())
      .set('mainId', mainId.toString());

    return this.http.get<any>(this.url, { params });
  }

  getTree(): Observable<TestCase[]> {
    return this.http.get<TestCase[]>(this.select_tree);
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
