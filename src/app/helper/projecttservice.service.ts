import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../pages/home/home.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSubject: BehaviorSubject<Project[]> = new BehaviorSubject<
    Project[]
  >([]);
  projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  constructor() {}

  addProject(project: Project): void {
    const projects = this.projectsSubject.value;
    this.projectsSubject.next([...projects, project]);
  }

  updateProject(id: number, updatedProject: Project): void {
    const projects = this.projectsSubject.value;
    const index = projects.findIndex((project) => project.id === id);
    if (index !== -1) {
      projects[index] = updatedProject;
      this.projectsSubject.next([...projects]);
    }
  }

  deleteProject(project: Project): void {
    const projects = this.projectsSubject.value;
    const updatedProjects = projects.filter((p) => p.id !== project.id);
    this.projectsSubject.next(updatedProjects);
  }

  setProjects(projects: Project[]): void {
    this.projectsSubject.next(projects);
  }
}
