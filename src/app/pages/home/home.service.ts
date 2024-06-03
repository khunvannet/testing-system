import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ProjectService } from 'src/app/helper/projecttservice.service';

export interface Project {
  id: number;
  title: string;
  description: string;
  alltest: number;
  alltestrun: number;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  _url: string = '../../../assets/data/project.json';

  getProjects(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this._url)
      .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'server error');
  }

  fetchAndSetProjects(): void {
    this.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projectService.setProjects(projects);
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
      },
    });
  }
}
