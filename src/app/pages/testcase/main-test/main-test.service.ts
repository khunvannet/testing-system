import { HttpClient } from '@angular/common/http';
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
  private url: string = 'http://localhost:8080/api/main';

  constructor(private http: HttpClient) {}

  getMain(): Observable<MainTest[]> {
    return this.http.get<MainTest[]>(this.url);
  }

  getMainByProjectId(projectId: number): Observable<MainTest[]> {
    return this.http.get<MainTest[]>(`${this.url}/project/${projectId}`);
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
}
