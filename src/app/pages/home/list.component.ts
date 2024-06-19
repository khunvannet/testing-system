import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { HomeService, Project } from './home.service';
import { HomeUiService } from './home-ui.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';

@Component({
  selector: 'app-list',
  template: `
    <ng-container *ngIf="projects.length > 0; else noProjects">
      <nz-header>
        <div class="header">
          <div class="btn-run">
            <button
              class="create-project"
              nz-button
              nzType="primary"
              (click)="showAdd()"
            >
              Create Test Run
            </button>
          </div>
        </div>
      </nz-header>
      <nz-table [nzNoResult]="noResult" [nzData]="projects" nzSize="small">
        <thead>
          <tr>
            <th class="col-header" nzWidth="50px">#</th>
            <th nzColumnKey="name" nzWidth="35%">Project Name</th>
            <th nzColumnKey="alltestcase" nzWidth="20%">All Test Cases</th>
            <th nzColumnKey="alltestrun" nzWidth="20%">All Test Run</th>
            <th nzWidth="165px"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let project of projects; let i = index">
            <td nzEllipsis>{{ i + 1 }}</td>
            <td nzEllipsis>
              <a
                [routerLink]="['/test/dashboard']"
                (click)="selectProject(project.id, project.name)"
              >
                {{ project.name }}
              </a>
            </td>
            <td nzEllipsis>0</td>
            <td nzEllipsis>0</td>
            <td style="display: flex;justify-content:end;">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <ng-container>
                  <a *nzSpaceItem nz-typography (click)="showEdit(project)">
                    <i
                      nz-icon
                      nzType="edit"
                      nzTheme="outline"
                      style="padding-right: 5px"
                    ></i>
                    Edit
                  </a>
                </ng-container>
                <ng-container>
                  <a
                    *nzSpaceItem
                    nz-typography
                    style="color: #F31313"
                    (click)="deleteProject(project.id)"
                  >
                    <i
                      nz-icon
                      nzType="delete"
                      nzTheme="outline"
                      style="padding-right: 5px"
                    ></i>
                    Delete
                  </a>
                </ng-container>
              </nz-space>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </ng-container>
    <ng-template #noProjects>
      <div class="container">
        <h5 style="font-size: 36px; margin-bottom: 6px;">
          <span nz-icon nzType="info-circle" nzTheme="outline"></span>
        </h5>
        <span class="title-menu">No Projects</span>
        <p id="text">
          No Project data available. Create a project to get started.
        </p>
        <button nz-button nzType="dashed" (click)="showAdd()">
          Create Project
        </button>
      </div>
    </ng-template>
  `,
  styles: [
    `
      #text {
        color: #7d8597;
      }

      .title-menu {
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 15%;
      }
      .header {
        display: flex;
        justify-content: flex-end;
      }
      .btn-run {
        margin-right: -40px;
      }
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background: #f8f9fa;
      }
      nz-table {
        margin-top: 10px;
      }
    `,
  ],
})
export class ListComponent implements OnInit {
  projects: Project[] = [];
  noResult: string | TemplateRef<any> | undefined = 'No Projects Found';

  constructor(
    private service: HomeService,
    public uiservice: HomeUiService,
    private projectSelectionService: ProjectSelectionService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects(): void {
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

  deleteProject(id: number): void {
    this.uiservice.showDelete(id, () => this.getAllProjects());
  }

  showAdd(): void {
    const modalRef = this.uiservice.showAdd();
    modalRef.afterClose.subscribe((result) => {
      if (result) {
        this.getAllProjects();
      }
    });
  }

  showEdit(project: Project): void {
    this.uiservice.showEdit(project).afterClose.subscribe(() => {
      this.getAllProjects();
    });
  }

  selectProject(projectId: number, projectName: string) {
    this.projectSelectionService.setSelectedProject({
      id: projectId,
      name: projectName,
    });
    console.log('id :' + projectId + '  ' + 'project name:' + projectName);
  }
}
