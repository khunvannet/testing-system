import { Component, OnInit, Output } from '@angular/core';
import { HomeService, Project } from '../home/home.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';

@Component({
  selector: 'app-selection',
  template: `
    <nz-select [(ngModel)]="selectedValue" nzDisabled="true">
      <nz-option
        *ngFor="let data of projects"
        [nzValue]="data.id"
        [nzLabel]="data.name"
      ></nz-option>
    </nz-select>
  `,
  styles: [
    `
      ::ng-deep.ant-select-disabled.ant-select .ant-select-selector {
        width: 270px;
      }
    `,
  ],
})
export class SelecionComponent implements OnInit {
  projects: Project[] = [];
  selectedValue: number | null = null;
  constructor(
    private service: HomeService,
    private projectSelectionService: ProjectSelectionService
  ) {}
  ngOnInit(): void {
    this.getAllProjects();
    const storedProject = this.projectSelectionService.getSelectedProject();
    if (storedProject) {
      this.selectedValue = storedProject.id;
    }

    // Subscribe to changes in selected project
    this.projectSelectionService.selectedProject$.subscribe((project) => {
      this.selectedValue = project ? project.id : null;
    });
  }

  private getProjectName(projectId: number | null): string {
    const selectedProject = this.projects.find(
      (project) => project.id === projectId
    );
    return selectedProject ? selectedProject.name : '';
  }

  getAllProjects() {
    this.service.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        console.log(this.projects);
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
      },
    });
  }
}
