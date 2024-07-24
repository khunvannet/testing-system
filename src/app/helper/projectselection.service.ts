import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Project {
  id: number | null;
  name: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectSelectionService {
  private readonly PROJECT_ID_KEY = 'selectedProjectId';
  private readonly PROJECT_NAME_KEY = 'selectedProjectName';
  private selectedProjectSubject: BehaviorSubject<Project | null>;
  public selectedProject$: Observable<Project | null>;

  private projectsSubject: BehaviorSubject<Project[]>;
  public projects$: Observable<Project[]>;

  constructor() {
    const storedProjectId = localStorage.getItem(this.PROJECT_ID_KEY);
    const storedProjectName = localStorage.getItem(this.PROJECT_NAME_KEY);

    const initialProject: Project | null =
      storedProjectId && storedProjectName
        ? { id: +storedProjectId, name: storedProjectName }
        : null;

    this.selectedProjectSubject = new BehaviorSubject<Project | null>(
      initialProject
    );
    this.selectedProject$ = this.selectedProjectSubject.asObservable();

    this.projectsSubject = new BehaviorSubject<Project[]>([]);
    this.projects$ = this.projectsSubject.asObservable();
  }

  setSelectedProject(project: Project): void {
    if (project.id !== null && project.name !== null) {
      localStorage.setItem(this.PROJECT_ID_KEY, project.id.toString());
      localStorage.setItem(this.PROJECT_NAME_KEY, project.name);
    } else {
      localStorage.removeItem(this.PROJECT_ID_KEY);
      localStorage.removeItem(this.PROJECT_NAME_KEY);
    }

    this.selectedProjectSubject.next(project);
  }

  getSelectedProject(): Project | null {
    const storedProjectId = localStorage.getItem(this.PROJECT_ID_KEY);
    const storedProjectName = localStorage.getItem(this.PROJECT_NAME_KEY);

    return storedProjectId && storedProjectName
      ? { id: +storedProjectId, name: storedProjectName }
      : null;
  }

  setProjects(projects: Project[]): void {
    this.projectsSubject.next(projects);
  }

  addProject(project: Project): void {
    const currentProjects = this.projectsSubject.getValue();
    this.projectsSubject.next([...currentProjects, project]);
  }
}
