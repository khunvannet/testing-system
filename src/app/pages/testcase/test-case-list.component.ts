import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
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
    <ng-container
      *ngIf="mainId !== null && searchFilter.length > 0; else noTestCase"
    >
      <div class="table-case">
        <nz-table
          #tabletest
          nzShowSizeChanger
          [nzNoResult]="noResult"
          [nzData]="paginatedTests"
          [nzPageSize]="pageSize"
          [nzPageIndex]="pageIndex"
          (nzPageIndexChange)="onPageIndexChange($event)"
          (nzPageSizeChange)="onPageSizeChange($event)"
          nzSize="small"
          [nzTotal]="searchFilter.length"
          nzTableLayout="fixed"
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
            <tr *ngFor="let test of tabletest.data; let i = index">
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
  `,
  styles: [
    `
      .loading-container {
        position: relative;
        top: 40%;
        bottom: 60%;
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
export class TestCaseListComponent implements OnInit, OnChanges, OnDestroy {
  tests: TestCase[] = [];
  searchFilter: TestCase[] = [];
  paginatedTests: TestCase[] = [];
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  noResult: string | TemplateRef<any> = 'No Test Cases Available';
  @Input() mainId: number | null = null;
  @Input() searchTerm: string = '';
  private subscriptions = new Subscription();

  constructor(
    private service: TestCaseService,
    public uiservice: TestCaseUiService,
    private cdr: ChangeDetectorRef,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.mainId = this.session.getSession('mainId');
    const dataChangeSub = this.uiservice.dataChanged.subscribe(() => {
      if (this.mainId !== null) {
        this.fetchTestsByMainId();
      }
    });

    this.subscriptions.add(dataChangeSub);

    if (this.mainId !== null) {
      this.fetchTestsByMainId();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainId']) {
      this.session.setSession('mainId', this.mainId);
      if (this.mainId !== null) {
        this.fetchTestsByMainId();
      } else {
        this.searchFilter = [];
        this.total = 0;
      }
    }
    if (changes['searchTerm']) {
      this.search();
    }
  }

  fetchTestsByMainId(): void {
    if (this.mainId !== null) {
      this.service.getTestByMainId(this.mainId).subscribe({
        next: (tests) => {
          setTimeout(() => {
            this.tests = tests;
            this.total = tests.length;
            this.search();
          }, 350);
        },
        error: (err) => {
          console.error('Failed to fetch tests:', err);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.updatePageData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.updatePageData();
  }

  deleteItem(id: number): void {
    this.uiservice.showDelete(id, () => {
      this.refreshList();
    });
  }

  refreshList(): void {
    if (this.mainId !== null) {
      this.fetchTestsByMainId();
    }
  }

  search(): void {
    if (this.searchTerm) {
      this.searchFilter = this.tests.filter((test) => {
        return (
          test.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          test.code.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.searchFilter = [...this.tests];
    }
    this.updatePageData();
  }

  private updatePageData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedTests = this.searchFilter.slice(start, end);
    this.cdr.markForCheck();
  }
}
