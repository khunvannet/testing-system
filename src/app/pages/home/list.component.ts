import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { HomeService, Project } from './home.service';
import { HomeUiService } from './home-ui.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { Subscription } from 'rxjs';

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
                (click)="uiService.showAdd()"
              >
                Create Project
              </button>
            </div>
          </div>
        </nz-header>
        <nz-table
          nzShowSizeChanger
          [nzNoResult]="noResult"
          [nzData]="projects"
          [nzPageSize]="pageSize"
          [nzPageIndex]="pageIndex"
          [nzTotal]="totalCount"
          nzSize="small"
          (nzPageIndexChange)="onPageIndexChange($event)"
          (nzPageSizeChange)="onPageSizeChange($event)"
          nzTableLayout="fixed"
          [nzFrontPagination]="false"
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
            <tr *ngFor="let project of projects; let i = index">
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
              <td style="display: flex; justify-content: end;">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <a
                    *nzSpaceItem
                    nz-typography
                    (click)="uiService.showEdit(project)"
                  >
                    <i
                      nz-icon
                      nzType="edit"
                      nzTheme="outline"
                      style="padding-right: 5px"
                    ></i>
                    Edit
                  </a>
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
            No project data available. Create a project to get started.
          </p>
          <button nz-button nzType="dashed" (click)="uiService.showAdd()">
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
export class ListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  noResult: string | TemplateRef<any> = 'No Projects Found';
  loading = true;
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  private subscriptions = new Subscription();
  private refreshSub$!: Subscription;

  constructor(
    private service: HomeService,
    public uiService: HomeUiService,
    private projectSelectionService: ProjectSelectionService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.getAllProjects();
    });
  }

  getAllProjects(): void {
    this.loading = true;
    this.service.getProjects(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.projects = response.results;
        this.pageIndex = response.param.pageIndex;
        this.pageSize = response.param.pageSize;
        this.totalCount = response.param.totalCount;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error fetching projects', err);
      },
    });
  }

  deleteProject(id: number): void {
    this.uiService.showDelete(id, () => this.getAllProjects());
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getAllProjects();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllProjects();
  }

  selectProject(projectId: number, projectName: string): void {
    this.projectSelectionService.setSelectedProject({
      id: projectId,
      name: projectName,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
