import { Component, OnInit } from '@angular/core';
import { TestCaseUiService } from './test-case-ui.service';
import { HomeService, Project } from '../home/home.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { HomeUiService } from '../home/home-ui.service';

@Component({
  selector: 'app-testcase',
  template: `
    <nz-layout>
      <nz-content>
        <nz-layout>
          <nz-sider class="sub-sidebar" nzWidth="256px">
            <div class="select-project">
              <nz-select
                [(ngModel)]="selectedValue"
                (ngModelChange)="onProjectChange($event)"
                [nzDropdownRender]="actionItem"
              >
                <nz-option
                  *ngFor="let data of projects"
                  [nzValue]="data.id"
                  [nzLabel]="data.name"
                >
                  {{ data.name }}
                </nz-option>
                <ng-template #actionItem>
                  <a class="item-action" (click)="this.uiProject.showAdd()">
                    <i nz-icon nzType="plus"></i> Add
                  </a>
                </ng-template>
              </nz-select>
            </div>
            <div>
              <app-main-list
                [projectId]="selectedValue"
                (mainId)="handleMainId($event)"
              ></app-main-list>
            </div>
          </nz-sider>
        </nz-layout>

        <div class="content-test">
          <nz-header>
            <nz-input-group [nzSuffix]="suffixIconSearch">
              <input
                type="text"
                nz-input
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearch()"
              />
            </nz-input-group>
            <ng-template #suffixIconSearch>
              <span nz-icon nzType="search"></span>
            </ng-template>

            <button
              (click)="this.uiService.showAdd(selectedMainId)"
              class="create-project"
              nz-button
              nzType="primary"
            >
              Create Test Case
            </button>
          </nz-header>
          <app-test-case-list
            [mainId]="selectedMainId"
            [searchTerm]="searchTerm"
          ></app-test-case-list>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .item-action {
        padding-left: 10px;
      }
      nz-select {
        width: 235px;
      }

      .select-project {
        margin: 10px;
        margin-top: 17px;
        width: 100px;
      }
      nz-input-group {
        width: 250px;
      }
      .title-menu {
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
      }

      .content-test {
        width: 100%;
      }

      .sub-sidebar {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 10;
        min-height: 88vh;
        background: #fff;
      }
      nz-content {
        margin: 11px;
        display: flex;
        min-height: 92vh;
        background: #fff;
        width: 98%;
      }

      #text {
        color: #7d8597;
      }

      #text #get-start {
        margin-left: 60px;
      }
      @media (max-width: 575px) {
        .content-test {
          nz-header {
            width: 675px;
          }
        }
        .item-center {
          margin-top: 5%;
        }
        .input-search {
          width: 100%; /* Full width for small phones */
        }
        .large-icon {
          font-size: 20px; /* Further adjust icon size for small phones */
        }
        .text1 {
          font-size: 10px; /* Further adjust text size for small phones */
        }
        @media (max-width: 768px) {
          nz-header {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 0 16px;
            display: flex;
            align-items: center;
            background: #fff;
            width: 535px;
          }
        }
      }
    `,
  ],
})
export class TestcaseComponent implements OnInit {
  projects: Project[] = [];
  selectedValue: number | null = null;
  selectedMainId: number | null = null;
  mainId: number = 0;
  searchTerm: string = '';

  constructor(
    public uiService: TestCaseUiService,
    private service: HomeService,
    private projectSelectionService: ProjectSelectionService,
    public uiProject: HomeUiService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    const storedProject = this.projectSelectionService.getSelectedProject();
    if (storedProject) {
      this.selectedValue = storedProject.id;
    }

    this.projectSelectionService.selectedProject$.subscribe((project) => {
      this.selectedValue = project ? project.id : null;
    });
  }

  onProjectChange(selectedValue: number | null): void {
    this.projectSelectionService.setSelectedProject({
      id: selectedValue,
      name: this.getProjectName(selectedValue),
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
        this.uiService.dataChanged.emit();
      },
      error: (err: any) => {
        console.error('Error fetching projects:', err);
      },
    });
  }

  handleMainId(id: number): void {
    this.selectedMainId = id;
  }

  onSearch(): void {}
}
