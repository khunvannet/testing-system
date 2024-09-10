import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TestCase, TestCaseService } from './test-case.service';
import { TestCaseUiService } from './test-case-ui.service';
@Component({
  selector: 'app-test-case-list',
  template: `
    <nz-header>
      <app-input-search
        [(searchQuery)]="param.searchQuery"
        (search)="onSearch($event)"
      ></app-input-search>
      <button
        (click)="uiService.showAdd(mainId!)"
        class="create-project"
        nz-button
        nzType="primary"
        [disabled]="!mainId"
      >
        {{ 'Create Test Case' | translate }}
      </button>
    </nz-header>
    <div class="table-case">
      <nz-table
        nzShowSizeChanger
        [nzNoResult]="noResult"
        [nzData]="tests"
        [nzTotal]="totalCount"
        nzSize="small"
        nzTableLayout="fixed"
        [nzFrontPagination]="false"
        [nzNoResult]="noResult"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
        [nzLoading]="loading"
      >
        <ng-template #noResult>
          <app-no-result-found></app-no-result-found>
        </ng-template>
        <thead>
          <tr>
            <th class="t-head" nzWidth="5%">#</th>
            <th class="t-head" nzWidth="10%">{{ 'Code' | translate }}</th>
            <th class="t-head" nzWidth="35%">{{ 'Name' | translate }}</th>
            <th class="t-head" nzWidth="30%">
              {{ 'Description' | translate }}
            </th>
            <th class="t-head" nzWidth="20%"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let test of tests; let i = index">
            <td nzEllipsis>
              {{ (param.pageIndex - 1) * param.pageSize + i + 1 }}
            </td>
            <td nzEllipsis>
              <a (click)="uiService.showDetail()">{{ test.code }}</a>
            </td>
            <td nzEllipsis>{{ test.name }}</td>
            <td nzEllipsis>{{ test.description }}</td>
            <td class="action-buttons">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <a
                  *nzSpaceItem
                  nz-typography
                  (click)="uiService.showEdit(test.id, test.name, test.mainId)"
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
                  (click)="uiService.showDelete(test.id, test.name)"
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
  @Input() mainId: number | null = null;
  tests: TestCase[] = [];
  totalCount = 0;
  param = {
    pageIndex: 1,
    pageSize: 10,
    searchQuery: '',
  };
  loading = false;
  private refreshSub$!: Subscription;

  constructor(
    private service: TestCaseService,
    public uiService: TestCaseUiService
  ) {}

  ngOnInit(): void {
    this.fetchTests();
    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.fetchTests();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainId']) {
      this.fetchTests();
    }
  }

  fetchTests(): void {
    this.loading = true;
    this.service.getAll(this.param).subscribe({
      next: (response: any) => {
        setTimeout(() => {
          this.tests = response.results.filter(
            (item: TestCase) => item.mainId === this.mainId
          );
          this.totalCount = response.totalCount;
          this.loading = false;
        }, 500);
      },
      error: (error: any) => {
        console.error('Fetching data Error', error);
        this.loading = false;
      },
    });
  }

  onPageIndexChange(pageIndex: number): void {
    this.param.pageIndex = pageIndex;
    this.fetchTests();
  }

  onPageSizeChange(pageSize: number): void {
    this.param.pageSize = pageSize;
    this.fetchTests();
  }

  onSearch(query: string): void {
    this.param.pageIndex = 1;
    this.param.searchQuery = query;
    this.fetchTests();
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
