import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MainTest {
  id: number;
  name: string;
  project_Id: number;
}

@Injectable({
  providedIn: 'root',
})
export class MainTestService {
  private url: string = 'http://localhost:8080/api/main';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<MainTest[]> {
    return this.http.get<MainTest[]>(this.url);
  }
}
