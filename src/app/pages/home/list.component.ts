import { Component, OnInit, TemplateRef } from '@angular/core';
import { HomeService, Project } from './home.service';
import { HomeUiService } from './home-ui.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';

@Component({
  selector: 'app-list',
  template: `
    <ng-container *ngIf="!loading; else loadingTemplate">
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
                Create Project
              </button>
            </div>
          </div>
        </nz-header>
        <nz-table
          #tabletest
          nzShowSizeChanger
          [nzNoResult]="noResult"
          [nzData]="projects"
          [nzPageSize]="pageSize"
          [nzPageIndex]="pageIndex"
          nzSize="small"
          (nzPageIndexChange)="onPageIndexChange($event)"
          (nzPageSizeChange)="onPageSizeChange($event)"
          nzTableLayout="fixed"
        >
          <thead>
            <tr>
              <th class="t-head" nzWidth="5%">#</th>
              <th class="t-head" nzWidth="25%">Project Name</th>
              <th class="t-head" nzWidth="25%">Description</th>
              <th class="t-head" nzWidth="10%">All Test Cases</th>
              <th class="t-head" nzWidth="10%">All Test Run</th>
              <th class="t-head" nzWidth="25%"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let project of tabletest.data; let i = index">
              <td nzEllipsis>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
              <td nzEllipsis>
                <a
                  [routerLink]="['/test/dashboard']"
                  (click)="selectProject(project.id, project.name)"
                >
                  {{ project.name }}
                </a>
              </td>
              <td nzEllipsis>{{ project.description }}</td>
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
    </ng-container>
    <ng-template #loadingTemplate>
      <div class="loading-container">
        <nz-spin></nz-spin>
      </div>
    </ng-template>
  `,
  styles: [
    `
      nz-table {
        max-height: 495px;
        overflow-y: auto;
      }
      .t-head {
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 1;
      }

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
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
    `,
  ],
})
export class ListComponent implements OnInit {
  projects: Project[] = [];
  noResult: string | TemplateRef<any> | undefined = 'No Projects Found';
  loading: boolean = true;
  pageIndex = 1;
  pageSize = 10;
  total = 999999;
  constructor(
    private service: HomeService,
    public uiservice: HomeUiService,
    private projectSelectionService: ProjectSelectionService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects(): void {
    this.loading = true;
    this.service.getProjects().subscribe({
      next: (projects: Project[]) => {
        setTimeout(() => {
          this.projects = projects;
          this.total = projects.length;
          this.loading = false;
        }, 350);
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
        this.loading = false;
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

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
  }
  selectProject(projectId: number, projectName: string) {
    this.projectSelectionService.setSelectedProject({
      id: projectId,
      name: projectName,
    });
    console.log('id :' + projectId + '  ' + 'project name:' + projectName);
  }
}
