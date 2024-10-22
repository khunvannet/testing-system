import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TestCase, TestCaseService } from './testcase-case.service';
import { TestCaseUiService } from './testcase-ui.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';
@Component({
  selector: 'app-test-case-list',
  template: `
    <nz-header>
      <div>
        <app-filter-input
          (filterChanged)="searchText = $event; param.pageIndex = 1; search()"
        ></app-filter-input>
        <button
          *ngIf="draged"
          nz-button
          nzType="primary"
          style="margin-left:10px; "
          (click)="saveOrdering()"
        >
          {{ 'Save' | translate }}
        </button>
      </div>

      <button
        (click)="uiService.showAdd(mainId!)"
        nz-button
        nzType="primary"
        [disabled]="!mainId"
      >
        <i nz-icon nzType="plus" nzTheme="outline"></i>
        {{ 'Add' | translate }}
      </button>
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
            <th class="t-head" nzWidth="5%"></th>
            <th class="t-head" nzWidth="5%">#</th>
            <th class="t-head" nzWidth="10%">{{ 'Code' | translate }}</th>
            <th class="t-head" nzWidth="35%">{{ 'Name' | translate }}</th>
            <th class="t-head" nzWidth="25%">
              {{ 'Description' | translate }}
            </th>
            <th class="t-head" nzWidth="20%"></th>
          </tr>
        </thead>
        <tbody
          cdkDropList
          (cdkDropListDropped)="drop($event)"
          [cdkDropListData]="lists"
        >
          <tr *ngFor="let test of lists; let i = index" cdkDrag>
            <td style="width: 35px; cursor: move;" cdkDragHandle>
              <span nz-icon nzType="holder" nzTheme="outline"></span>
            </td>
            <td nzEllipsis>
              {{
                ((param.pageIndex || 1) - 1) * (param.pageSize || 10) + i + 1
              }}
            </td>
            <td nzEllipsis style="flex: 0.8;">
              {{ test.code }}
            </td>
            <td nzEllipsis style="flex: 2.2;">{{ test.name }}</td>
            <td nzEllipsis style="flex: 1.4;">{{ test.description }}</td>
            <td style="flex: 1.2; display: flex; justify-content: end;">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <a
                  *nzSpaceItem
                  nz-typography
                  (click)="uiService.showEdit(test.id!, test.mainId!)"
                >
                  <i
                    nz-icon
                    nzType="edit"
                    nzTheme="outline"
                    class="icon-padding"
                  ></i>
                  {{ 'Edit' | translate }}
                </a>
                <a
                  *nzSpaceItem
                  nz-typography
                  class="delete-link"
                  (click)="uiService.showDelete(test.id!)"
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
      .block-move {
        width: 35px;
        cursor: move;
      }
      nz-input-group {
        width: 250px;
      }
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
      }
      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .t-head {
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 1;
      }
      .table-case {
        margin: 15px;
        max-height: 495px;
        overflow-y: auto;
      }
      nz-header {
        background: #fff;
        border: 0.5px solid #cbe0f9;
      }

      .delete-link {
        color: #f31313;
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
export class TestCaseListComponent
  extends BaseListComponent<TestCase>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() mainId: number = 0;
  @Input() prId: number = 0;
  draged: boolean = false;
  private refreshSub$!: Subscription;

  constructor(
    service: TestCaseService,
    public uiService: TestCaseUiService,
    private notification: NzNotificationService
  ) {
    super(service);
  }

  override ngOnInit(): void {
    this.refreshSub$ = this.uiService.refresher.subscribe(() => this.search());
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.search();
  }
  override search(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: 'search', operator: 'contains', value: this.searchText },
        { field: 'mainId', operator: 'eq', value: this.mainId },
      ];

      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (response: any) => {
          this.lists = response.results;
          this.totalList = response.param.rowCount;
          this.loading = false;
        },
        error: () => {
          this.notification.error('Project', 'Fetching data failed');
          this.loading = false;
        },
      });
    }, 150);
  }

  saveOrdering() {
    this.loading = true;
    let newLists: TestCase[] = [];

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
  drop(event: CdkDragDrop<TestCase[], any, any>): void {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    if (event.previousIndex !== event.currentIndex) this.draged = true;
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
