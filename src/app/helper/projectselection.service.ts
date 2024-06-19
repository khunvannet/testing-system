import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectSelectionService {
  private selectedProjectSubject: BehaviorSubject<{
    id: number | null;
    name: string | null;
  } | null>;
  public selectedProject$: Observable<{
    id: number | null;
    name: string | null;
  } | null>;

  constructor() {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    const storedProjectName = localStorage.getItem('selectedProjectName');
    this.selectedProjectSubject = new BehaviorSubject<{
      id: number | null;
      name: string | null;
    } | null>(
      storedProjectId && storedProjectName
        ? { id: +storedProjectId, name: storedProjectName }
        : null
    );
    this.selectedProject$ = this.selectedProjectSubject.asObservable();
  }

  setSelectedProject(project: {
    id: number | null;
    name: string | null;
  }): void {
    localStorage.removeItem('selectedProjectId'); // Clear old selection
    localStorage.removeItem('selectedProjectName');
    if (project.id !== null && project.name !== null) {
      localStorage.setItem('selectedProjectId', project.id.toString()); // Store new selection
      localStorage.setItem('selectedProjectName', project.name);
    }
    this.selectedProjectSubject.next(project);
  }

  getSelectedProject(): { id: number | null; name: string | null } | null {
    return this.selectedProjectSubject.getValue();
  }
}
