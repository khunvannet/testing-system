import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HomeUiService } from './home-ui.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { HomeService, Project } from './home.service';

@Component({
  selector: 'app-list',
  template: `
    <nz-header> 
      <div class="header">
        <app-input-search
          [(searchQuery)]="param.searchQuery"
          (search)="onSearch($event)"
        ></app-input-search>
        <div style="padding: 1.5px;">
          <button nz-button nzType="primary" (click)="uiService.showAdd()">{{'Create Project' | translate}}</button>
        </div> 
      </div>
    </nz-header>
    <nz-table
      nzShowSizeChanger
      nzShowPagination
      nzSize="small"
      [nzData]="projects"
      [nzTotal]="totalCount"
      [nzPageIndex]="param.pageIndex"
      [nzPageSize]="param.pageSize"
      [nzFrontPagination]="false"
      [nzLoading]="loading"
      [nzNoResult]="noResult"
      nzTableLayout="fixed"
      (nzPageIndexChange)="onPageIndexChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)"
    >
      <ng-template #noResult>
        <app-no-result-found></app-no-result-found>
      </ng-template>
      <thead>
        <tr>
          <th nzWidth="5%">#</th>
          <th nzWidth="25%">{{'Project Name' | translate}}</th>
          <th nzWidth="25%">{{ 'Description' | translate }}</th>
          <th nzWidth="10%">{{'All Test Cases' | translate}}</th>
          <th nzWidth="10%">{{'All Test Run' | translate}}</th>
          <th nzWidth="25%"></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of projects; let i = index">
          <td>{{ (param.pageIndex - 1) * param.pageSize + i + 1 }}</td>
          <td><a [routerLink]="['/test/dashboard']" (click)="clickSelect(data.id!)">{{ data.name }}</a></td>
          <td>{{ data.description }}</td>
          <td>0</td>
          <td>0</td>
          <td style="display: flex; justify-content: end;">
            <nz-space [nzSplit]="spaceSplit">
              <ng-template #spaceSplit>
                <nz-divider nzType="vertical"></nz-divider>
              </ng-template>
              <a *nzSpaceItem nz-typography (click)="uiService.showEdit(data.id || 0, data.name!)">
                <i nz-icon nzType="edit" nzTheme="outline"></i>
                {{'Edit' | translate}}
              </a>
              <a *nzSpaceItem nz-typography style="color: #F31313" (click)="uiService.showDelete(data.id || 0, data.name!)">
                <i nz-icon nzType="delete" nzTheme="outline"></i>
                {{'Delete' | translate}}
              </a>
            </nz-space>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: [`
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
      justify-content: space-between;
    }
    nz-header {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background: #f8f9fa;
    }
    nz-table {
      margin-top: 10px;
    }
  `],
})
export class ListComponent implements OnInit, OnDestroy {
  @Output() pId = new EventEmitter<number | null>(); // Define the EventEmitter

  projects: Project[] = [];
  loading = false;
  totalCount = 0;
  param = {
    pageIndex: 1,
    pageSize: 10,
    searchQuery: ''
  };
  private refreshSub$!: Subscription;

  constructor(
    private service: HomeService,
    public uiService: HomeUiService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.getAllProjects();
    });
  }

  getAllProjects(): void {
    this.loading = true;
    this.service.getAll(this.param).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.projects = response.results;
          this.totalCount = response.totalCount;
          this.loading = false;
        }, 500);
      },
      error: (error: any) => {
        console.error("Error Fetching data", error);
        this.notification.error('Project', 'Failed to get data');
        this.loading = false;
      }
    });
  }

  onPageIndexChange(pageIndex: number): void {
    this.param.pageIndex = pageIndex;
    this.getAllProjects();
  }

  onPageSizeChange(pageSize: number): void {
    this.param.pageSize = pageSize;
    this.getAllProjects();
  }

  onSearch(query: string): void {
    this.param.pageIndex = 1;
    this.param.searchQuery = query;
    this.getAllProjects();
  }

  clickSelect(id: number): void {
    this.pId.emit(id); // Emit the selected project ID
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
