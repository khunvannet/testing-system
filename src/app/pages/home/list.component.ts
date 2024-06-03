import { Component, OnInit, TemplateRef } from '@angular/core';

import { HomeService, Project } from './home.service';
import { ListUiService } from './list-ui.service';
import { ProjectService } from 'src/app/helper/projecttservice.service';

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
              (click)="uiservice.showAdd()"
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
              <a routerLink="/test/dashboard"> {{ project.title }} </a>
            </td>
            <td nzEllipsis>{{ project.alltest }}</td>
            <td nzEllipsis>{{ project.alltestrun }}</td>
            <td style="display: flex;justify-content:end; ">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <ng-container>
                  <a
                    *nzSpaceItem
                    nz-typography
                    (click)="this.uiservice.showEdit(project)"
                  >
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
                    (click)="this.uiservice.showDelete(project)"
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
      <app-no-project-found></app-no-project-found>
    </ng-template>
  `,
  styles: [
    `
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
      @media (max-width: 575px) {
      }
    `,
  ],
})
export class ListComponent implements OnInit {
  projects: Project[] = [];
  noResult: string | TemplateRef<any> | undefined;

  constructor(
    private projectService: ProjectService,
    private homeService: HomeService,
    public uiservice: ListUiService
  ) {}

  ngOnInit(): void {
    this.homeService.fetchAndSetProjects(); // Load initial projects
    this.projectService.projects$.subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        console.log(this.projects);
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
      },
    });
  }

  editProject(project: Project): void {
    this.uiservice.showEdit(project); // Pass project data to the service to show the edit form
  }
}
