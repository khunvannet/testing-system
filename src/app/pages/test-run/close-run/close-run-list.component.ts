import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';
import { TestRunUiService } from '../test-run-ui.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TestRun, TestRunService } from '../test-run.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-close-run',
  template: `
    <nz-header>
      <nz-header>
        <div class="header-container">
          <div class="left-elements">
            <app-filter-input
              (filterChanged)="
                searchText = $event; param.pageIndex = 1; search()
              "
            ></app-filter-input>
            <app-select-project
              (valueChanged)="onProjectChange($event)"
            ></app-select-project>
            <button
              *ngIf="draged"
              nz-button
              nzType="primary"
              style="margin-left:10px;"
              (click)="saveOrdering()"
            >
              {{ 'Save' | translate }}
            </button>
          </div>
        </div>
      </nz-header>
    </nz-header>

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
            <th nzWidth="5%"></th>
            <th nzWidth="5%">#</th>
            <th nzWidth="10%">{{ 'Code' | translate }}</th>
            <th nzWidth="25%">{{ 'Name' | translate }}</th>
            <th nzWidth="10%">{{ 'No of test' | translate }}</th>
            <th nzWidth="25%">{{ 'Description' | translate }}</th>
            <th nzWidth="20%"></th>
          </tr>
        </thead>
        <tbody
          cdkDropList
          (cdkDropListDropped)="drop($event)"
          [cdkDropListData]="lists"
        >
          <tr *ngFor="let data of lists; let i = index" cdkDrag>
            <td style="width: 35px; cursor: move;" cdkDragHandle>
              <span nz-icon nzType="holder" nzTheme="outline"></span>
            </td>
            <td nzEllipsis>
              {{
                ((param.pageIndex || 1) - 1) * (param.pageSize || 10) + i + 1
              }}
            </td>
            <td nzEllipsis style="flex: 0.8;">
              <a [routerLink]="['/test/test_run', data.id]">{{ data.code }} </a>
            </td>
            <td nzEllipsis style="flex: 2;">{{ data.name }}</td>
            <td nzEllipsis style="flex: 1;">{{ data.testName?.length }}</td>
            <td nzEllipsis style="flex: 1.5;">{{ data.description }}</td>
            <td class="action-buttons" style="flex: 2;">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <a
                  *nzSpaceItem
                  nz-typography
                  style="color: green;"
                  (click)="this.uiService.showRunAgain(data.id!)"
                >
                  <span nz-icon nzType="arrow-left" nzTheme="outline"></span>
                  Run Again
                </a>
                <a
                  *nzSpaceItem
                  nz-typography
                  class="delete-link "
                  (click)="this.uiService.showDelete(data.id!)"
                >
                  <i
                    nz-icon
                    nzType="delete"
                    nzTheme="outline"
                    class="icon-padding"
                  ></i>
                  {{ 'Delete' | translate }}
                </a>
              </nz-space>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [
    `
      .action-buttons {
        display: flex;
        justify-content: flex-end;
      }
      .table-case {
        margin-top: 10px;
      }
      ::ng-deep .ant-table-wrapper {
        background-color: #fff;
      }
      .delete-link {
        color: #f31313;
      }
      nz-header {
        background: #f8f9fa;
        padding: 0;
        padding-left: 5px;
      }
      .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .left-elements {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      ::ng-deep .cdk-drag-preview {
        display: flex;
        background: rgba(0, 0, 0, 0.1);
        gap: 1em;

        align-items: center;
        padding: 0 4px;
      }

      ::ng-deep .cdk-drag-placeholder {
        opacity: 0;
      }
    `,
  ],
})
export class CloseRunListComponent
  extends BaseListComponent<TestRun>
  implements OnInit, OnDestroy
{
  projectId = 0;
  draged: boolean = false;
  private refreshSub$!: Subscription;

  constructor(
    service: TestRunService,
    public uiService: TestRunUiService,
    private notification: NzNotificationService
  ) {
    super(service);
  }

  override ngOnInit(): void {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    if (storedProjectId) {
      this.projectId = +storedProjectId;
      this.search();
    }
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
  }
  override search(): void {
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      const filters = [
        { field: 'search', operator: 'contains', value: this.searchText },
        { field: 'projectId', operator: 'eq', value: this.projectId },
        { field: 'Active', operator: 'eq', value: false },
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
  onProjectChange(projectId: number): void {
    this.projectId = projectId;
    localStorage.setItem('selectedProjectId', projectId.toString());
    this.search();
  }
  saveOrdering() {
    this.loading = true;
    let newLists: TestRun[] = [];

    this.lists.forEach((item, i) => {
      item.ordering = i + 1;
      newLists.push(item);
    });
    this.service.updateOrdering(newLists).subscribe(() => {
      this.loading = false;
      this.draged = false;
      this.notification.success('update-ordering', 'Successfully Saved');
    });
  }
  drop(event: CdkDragDrop<TestRun[], any, any>): void {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    if (event.previousIndex !== event.currentIndex) this.draged = true;
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
