import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private url: string = 'http://localhost:8080/api/project';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.url}/${id}`);
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
}
