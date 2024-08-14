import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MainTest {
  id: number;
  name: string;
  projectId: number;
}

@Injectable({
  providedIn: 'root',
})
export class MainTestService {
  private readonly url = 'http://127.0.0.1:8000/api/main';
  private url_exists = 'http://127.0.0.1:8000/api/main/isExist';
  constructor(private http: HttpClient) {}

  getMain(): Observable<MainTest[]> {
    return this.http.get<MainTest[]>(this.url);
  }
  addMain(main: MainTest): Observable<MainTest> {
    return this.http.post<MainTest>(this.url, main);
  }

  updateMain(id: number, mainTest: MainTest): Observable<MainTest> {
    return this.http.put<MainTest>(`${this.url}/${id}`, mainTest);
  }

  deleteMain(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  isExists(name: string): Observable<{ exists: boolean }> {
    const params = new HttpParams().set('name', name);
    return this.http.get<{ exists: boolean }>(this.url_exists, { params });
  }
}
