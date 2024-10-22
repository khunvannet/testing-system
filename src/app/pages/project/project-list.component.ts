import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { HomeUiService } from './project-ui.service';
import { Subscription } from 'rxjs';
import { HomeService, Project } from './project.service';
import { ProjectService } from 'src/app/helper/project-select.service';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';

@Component({
  selector: 'app-list',
  template: `
    <nz-header>
      <div class="header">
        <app-filter-input
          (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
        ></app-filter-input>
        <div style="margin-right: 10px;">
          <button nz-button nzType="primary" (click)="uiService.showAdd()">
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            {{ 'Add' | translate }}
          </button>
        </div>
      </div>
    </nz-header>
    <nz-table
      [nzData]="lists"
      nzTableLayout="fixed"
      nzShowSizeChanger
      nzShowPagination
      [nzFrontPagination]="false"
      [nzPageIndex]="param.pageIndex!"
      [nzPageSize]="param.pageSize!"
      nzSize="small"
      [nzTotal]="totalList"
      [nzLoading]="loading"
      [nzNoResult]="noResult"
      (nzQueryParams)="onQueryParamsChange($event)"
    >
      <ng-template #noResult>
        <app-no-result-found></app-no-result-found>
      </ng-template>
      <thead>
        <tr>
          <th nzWidth="5%">#</th>
          <th nzWidth="25%">{{ 'Project Name' | translate }}</th>
          <th nzWidth="25%">{{ 'Description' | translate }}</th>
          <th nzWidth="10%">{{ 'All Test Cases' | translate }}</th>
          <th nzWidth="10%">{{ 'All Test Run' | translate }}</th>
          <th nzWidth="25%"></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of lists; let i = index">
          <td>
            {{ ((param.pageIndex || 1) - 1) * (param.pageSize || 10) + i + 1 }}
          </td>

          <td>
            <a
              [routerLink]="['/test/dashboard']"
              (click)="clickSelect(data.id!)"
              >{{ data.name }}</a
            >
          </td>
          <td>{{ data.description }}</td>
          <td>0</td>
          <td>0</td>
          <td style="display: flex; justify-content: end;">
            <nz-space [nzSplit]="spaceSplit">
              <ng-template #spaceSplit>
                <nz-divider nzType="vertical"></nz-divider>
              </ng-template>
              <a
                *nzSpaceItem
                nz-typography
                (click)="uiService.showEdit(data.id || 0)"
              >
                <i nz-icon nzType="edit" nzTheme="outline"></i>
                {{ 'Edit' | translate }}
              </a>
              <a
                *nzSpaceItem
                nz-typography
                style="color: #F31313"
                (click)="uiService.showDelete(data.id || 0, data.name!)"
              >
                <i nz-icon nzType="delete" nzTheme="outline"></i>
                {{ 'Delete' | translate }}
              </a>
            </nz-space>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: [
    `
      nz-table {
        max-height: 495px;
        overflow-y: auto;
        margin-top: 10px;
      }
      .t-head {
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 1;
      }
      .header {
        display: flex;
        justify-content: space-between;
      }
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background: #f8f9fa;
        padding: 0 0 0 10px;
      }
    `,
  ],
})
export class ListComponent
  extends BaseListComponent<Project>
  implements OnInit, OnDestroy
{
  @Output() pId = new EventEmitter<any | null>();
  private refreshSub$!: Subscription;

  constructor(
    service: HomeService,
    public uiService: HomeUiService,
    private projectService: ProjectService
  ) {
    super(service);
  }

  override ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
  }
  override search(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: 'name', operator: 'contains', value: this.searchText },
      ];
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (response: any) => {
          this.lists = response.results;
          this.totalList = response.param.rowCount;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }, 50);
  }
  clickSelect(id: number): void {
    this.projectService.changeProjectId(id);
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
