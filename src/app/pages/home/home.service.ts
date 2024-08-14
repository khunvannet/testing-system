import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  private url: string = 'http://127.0.0.1:8000/api/projects';
  private url_select = 'http://127.0.0.1:8000/api/SelectProject';
  private url_exists = 'http://127.0.0.1:8000/api/projects/isExist';

  getProjects(pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(this.url, { params });
  }

  getSelect(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url_select);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.url, project);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.url}/${id}`, project);
  }

  deleteProject(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  isExists(name: string): Observable<{ exists: boolean }> {
    const params = new HttpParams().set('name', name);
    return this.http.get<{ exists: boolean }>(this.url_exists, { params });
  }
}
