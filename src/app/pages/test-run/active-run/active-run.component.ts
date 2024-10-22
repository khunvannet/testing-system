import { Component, OnDestroy, OnInit } from '@angular/core';
import { RunUiService } from './active-run-ui.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';
import { Rundetail, RunService } from './active-run.service';

@Component({
  selector: 'app-run',
  template: `<nz-header>
      <div class="header">
        <div style="margin-left: -30px; margin-top:5px;">
          <app-breadcrumb
            *ngIf="breadcrumbData"
            [data]="breadcrumbData"
          ></app-breadcrumb>
        </div>
        <div class="search">
          <app-filter-input
            (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
          ></app-filter-input>
        </div>
        <div class="select-status">
          <app-EnumStatus
            (valueChanged)="onStatusChange($event)"
          ></app-EnumStatus>
        </div>
      </div>
    </nz-header>
    <nz-layout>
      <nz-content>
        <div class="table-case">
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
                <th nzWidth="50px">#</th>
                <th nzColumnKey="code" nzWidth="100px">Code</th>
                <th nzColumnKey="title" nzWidth="35%">Title</th>
                <th nzColumnKey="status" nzWidth="100px">Status</th>
                <th nzWidth="165px"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of lists; let i = index">
                <td nzEllipsis>
                  {{
                    ((param.pageIndex || 1) - 1) * (param.pageSize || 10) +
                      i +
                      1
                  }}
                </td>
                <td nzEllipsis>{{ data.code }}</td>

                <td nzEllipsis>{{ data.testName }}</td>

                <td nzEllipsis>{{ data.statusName }}</td>
                <td class="action-buttons">
                  <nz-space>
                    <button
                      nzSize="small"
                      *nzSpaceItem
                      nz-button
                      nzType="primary"
                      nzGhost
                    >
                      Test
                    </button>
                    <button
                      nzSize="small"
                      *nzSpaceItem
                      nz-button
                      nzType="primary"
                      nzGhost
                      style=" border-color:green; color:green;"
                    >
                      Skip
                    </button>
                  </nz-space>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>
      </nz-content>
    </nz-layout>`,
  styles: [
    `
      .select-status {
        margin-left: 15px;
      }
      .action-buttons {
        display: flex;
        justify-content: end;
      }
      .delete-link {
        color: red;
      }
      .table-case {
        margin-top: 10px;
        margin: 15px;
      }

      .search {
        margin-left: 35px;
      }

      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        background: #f8f9fa;
      }

      .header {
        display: flex;
      }
      nz-content {
        margin: 11px;
        display: flex;
        min-height: 78vh;
        background: #fff;
        min-width: 1000px;
      }
    `,
  ],
})
export class ActiveRunComponent
  extends BaseListComponent<Rundetail>
  implements OnInit, OnDestroy
{
  breadcrumbData!: Observable<any>;
  id?: number = 0;
  run: [] = [];
  statusId: number = 0;
  private refreshSub$!: Subscription;
  constructor(service: RunService, private route: ActivatedRoute) {
    super(service);
  }
  override ngOnInit(): void {
    this.breadcrumbData = this.route.data;
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
    });
  }
  override search(): void {
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      const filters = [
        { field: 'testName', operator: 'contains', value: this.searchText },
        { field: 'runId', operator: 'eq', value: this.id },
        { field: 'statusId', operator: 'eq', value: this.statusId },
      ];
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (response: any) => {
          this.lists = response.results;
          this.totalList = response.param.rowCount;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }, 150);
  }
  onStatusChange(selectedStatus: number): void {
    this.statusId = selectedStatus;
    this.search();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
