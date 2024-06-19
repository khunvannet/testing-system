import { Component, OnInit } from '@angular/core';
import { HomeService, Project } from '../../home/home.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';

@Component({
  selector: 'app-main-test',
  template: `
    <div class="select-project">
      <nz-select
        [(ngModel)]="selectedValue"
        (ngModelChange)="onProjectChange($event)"
      >
        <nz-option
          *ngFor="let data of projects"
          [nzValue]="data.id"
          [nzLabel]="data.name"
        ></nz-option>
      </nz-select>
    </div>
    <div>
      <app-main-list [projectId]="selectedValue"></app-main-list>
    </div>
  `,
  styles: [
    `
      ::ng-deep
        .ant-select-single.ant-select-show-arrow
        .ant-select-selection-item {
        width: 210px;
      }
      ::ng-deep
        .ant-select:not(.ant-select-customize-input)
        .ant-select-selector {
        width: 235px;
      }
      .select-project {
        margin: 10px;
        margin-top: 17px;
        width: 100px;
      }
    `,
  ],
})
export class MainTestComponent implements OnInit {
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

  onProjectChange(selectedValue: number | null): void {
    // Update selected project in ProjectSelectionService
    this.projectSelectionService.setSelectedProject({
      id: selectedValue,
      name: this.getProjectName(selectedValue),
    });
    console.log(selectedValue);
    console.log(this.getProjectName(selectedValue));
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
