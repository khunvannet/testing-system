import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TestCase, TestCaseService } from './test-case.service';
import { TestCaseUiService } from './test-case-ui.service';
import { SessionService } from 'src/app/helper/session.service';

@Component({
  selector: 'app-test-case-list',
  template: `
    <ng-container *ngIf="mainId !== null && tests.length > 0; else noTestCase">
      <div class="table-case" *ngIf="!loading; else loadingTemplate">
        <nz-table
          nzShowSizeChanger
          [nzNoResult]="noResult"
          [nzData]="tests"
          [nzPageSize]="pageSize"
          [nzPageIndex]="pageIndex"
          nzSize="small"
          [nzTotal]="total"
          (nzPageIndexChange)="onPageIndexChange($event)"
          (nzPageSizeChange)="onPageSizeChange($event)"
          nzTableLayout="fixed"
          [nzFrontPagination]="false"
        >
          <thead>
            <tr>
              <th class="t-head" nzWidth="5%">#</th>
              <th class="t-head" nzWidth="10%">Code</th>
              <th class="t-head" nzWidth="25%">Name</th>
              <th class="t-head" nzWidth="20%">Description</th>
              <th class="t-head" nzWidth="20%">Notes</th>
              <th class="t-head" nzWidth="20%"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let test of tests; let i = index">
              <td nzEllipsis>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
              <td nzEllipsis>
                <a (click)="uiservice.showDetail()">{{ test.code }}</a>
              </td>
              <td nzEllipsis>{{ test.name }}</td>
              <td nzEllipsis>{{ test.description }}</td>
              <td nzEllipsis>{{ test.notes }}</td>
              <td class="action-buttons">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <a
                    *nzSpaceItem
                    nz-typography
                    (click)="uiservice.showEdit(test, test.mainId)"
                  >
                    <i
                      nz-icon
                      nzType="edit"
                      nzTheme="outline"
                      class="icon-padding"
                    ></i>
                    Edit
                  </a>
                  <a
                    *nzSpaceItem
                    nz-typography
                    class="delete-link"
                    (click)="deleteItem(test.id)"
                  >
                    <i
                      nz-icon
                      nzType="delete"
                      nzTheme="outline"
                      class="icon-padding"
                    ></i>
                    Delete
                  </a>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </div>
    </ng-container>

    <ng-template #noTestCase>
      <app-no-test-case></app-no-test-case>
    </ng-template>
    <ng-template #loadingTemplate>
      <div class="loading-container">
        <nz-spin></nz-spin>
      </div>
    </ng-template>
  `,
  styles: [
    `
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
      .input-add {
        max-width: 970px;
        margin: 10px;
        margin-top: 40px;
      }
      nz-header {
        background: #fff;
        border: 0.5px solid #cbe0f9;
      }
      .action-buttons {
        display: flex;
        justify-content: end;
      }
      .icon-padding {
        padding-right: 5px;
      }
      .delete-link {
        color: #f31313;
      }
    `,
  ],
})
export class TestCaseListComponent implements OnInit, OnDestroy, OnChanges {
  tests: TestCase[] = [];
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  loading = false;
  noResult: string | TemplateRef<any> = 'No Test Cases Available';
  @Input() mainId: number | null = null;
  @Input() searchTerm: string = '';
  private subscriptions = new Subscription();
  private refreshSub$!: Subscription;
  constructor(
    private service: TestCaseService,
    public uiservice: TestCaseUiService,
    private cdr: ChangeDetectorRef,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.mainId = this.session.getSession('mainId');

    if (this.mainId !== null) {
      this.fetchTests();
    }
    this.refreshSub$ = this.uiservice.refresher.subscribe(() => {
      if (this.mainId !== null) {
        this.fetchTests();
      }
    });
    this.subscriptions.add(this.refreshSub$);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainId'] && !changes['mainId'].isFirstChange()) {
      this.fetchTests();
    }
    if (changes['searchTerm'] && !changes['searchTerm'].isFirstChange()) {
      this.search();
    }
  }

  fetchTests(): void {
    if (this.mainId !== null) {
      this.loading = true;
      this.service
        .getTest(this.pageIndex, this.pageSize, this.searchTerm, this.mainId)
        .subscribe({
          next: (response: any) => {
            if (this.mainId) {
              this.tests = response.results.filter(
                (item: TestCase) => item.mainId === this.mainId
              );
              this.pageIndex = response.param.pageIndex;
              this.pageSize = response.param.pageSize;
              this.total = response.param.totalCount;
              this.cdr.markForCheck();
              this.loading = false;
            }
          },
          error: (err) => {
            this.loading = false;
            console.error('Failed to fetch tests:', err);
          },
        });
    } else {
      this.tests = [];
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.fetchTests();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.fetchTests();
  }

  deleteItem(id: number): void {
    this.uiservice.showDelete(id, () => {
      this.fetchTests();
    });
  }

  search(): void {
    this.pageIndex = 1;
    this.fetchTests();
  }
}
