import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TestRunUiService } from '../test-run-ui.service';
import { TestRun, TestRunService } from '../test-run.service';

@Component({
  selector: 'app-close-run',
  template: `
    <nz-header>
      <nz-header>
        <div class="header-container">
          <div class="left-elements">
            <app-select-formain></app-select-formain>
            <app-input-search></app-input-search>
          </div>
        </div>
      </nz-header>
    </nz-header>
    <div class="table-case">
      <nz-table
        [nzNoResult]="noResult"
        [nzData]="testRun"
        nzSize="small"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
        nzTableLayout="fixed"
        [nzPageSize]="pageSize"
        [nzPageIndex]="pageIndex"
        [nzTotal]="totalCount"
        nzShowSizeChanger
        [nzFrontPagination]="false"
        [nzNoResult]="noResult"
      >
        <ng-template #noResult>
          <app-no-result-found></app-no-result-found>
        </ng-template>
        <thead>
          <tr>
            <th nzWidth="5%">#</th>
            <th nzWidth="10%">{{ 'Code' | translate }}</th>
            <th nzWidth="25%">{{ 'Name' | translate }}</th>
            <th nzWidth="10%">{{ 'No of test' | translate }}</th>
            <th nzWidth="30%">{{ 'Description' | translate }}</th>
            <th nzWidth="20%"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of testRun; let i = index">
            <td nzEllipsis>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
            <td nzEllipsis>
              {{ data.code }}
            </td>
            <td nzEllipsis>{{ data.name }}</td>
            <td nzEllipsis>{{ data.testCases?.length || 0 }}</td>
            <td nzEllipsis>{{ data.description }}</td>
            <td class="action-buttons">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <a
                  *nzSpaceItem
                  nz-typography
                  style="color: green;"
                  (click)="showActive(data.id)"
                >
                  <span nz-icon nzType="arrow-left" nzTheme="outline"></span>
                  Run Again
                </a>
                <a
                  *nzSpaceItem
                  nz-typography
                  class="delete-link"
                  (click)="deleteRun(data.id)"
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
      ::ng-deep .ant-dropdown-menu {
        width: 150px;
      }
      .action-buttons {
        display: flex;
        justify-content: end;
      }
      .table-case {
        margin-top: 10px;
      }
      .delete-link {
        color: red;
      }
      nz-header {
        background: #f8f9fa;
        padding: 0;
        padding-left: 5px;
      }
      .header-container {
        display: flex;
        align-items: center; /* Vertically center items */
        justify-content: space-between; /* Ensure button is on the far right */
      }

      .left-elements {
        display: flex;
        gap: 10px; /* Add 10px space between the select and input */
      }
    `,
  ],
})
export class CloseRunListComponent implements OnInit, OnDestroy {
  @Input() selectedProjectId: number | null = null;
  noResult: string | TemplateRef<any> | undefined;
  private subscriptions = new Subscription();
  testRun: TestRun[] = [];
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  loading = false;
  @Input() searchTerm: string = '';
  private refreshSub$!: Subscription;

  constructor(
    public uiService: TestRunUiService,
    private service: TestRunService
  ) {}

  ngOnInit(): void {
    this.getAllTestClose();
    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.getAllTestClose();
    });
    this.subscriptions.add(this.refreshSub$);
  }

  ngOnChanges(): void {
    this.getAllTestClose();
  }

  getAllTestClose(): void {
    this.loading = true;
    this.service
      .getCloseRun(
        this.pageIndex,
        this.pageSize,
        this.searchTerm,
        this.selectedProjectId
      )
      .subscribe({
        next: (data: {
          results: any[];
          param: { pageIndex: number; pageSize: number; totalCount: number };
        }) => {
          if (data && data.results) {
            if (this.selectedProjectId) {
              this.testRun = data.results.filter(
                (item: TestRun) => item.projectId === this.selectedProjectId
              );
            } else {
              this.testRun = data.results;
            }
            this.pageIndex = data.param.pageIndex;
            this.pageSize = data.param.pageSize;
            this.totalCount = data.param?.totalCount || 0;
            this.loading = false;
          }
        },
        error: (err: any) => {
          console.error('Failed to fetch test runs', err);
          this.loading = false;
        },
      });
  }
  deleteRun(id: number): void {
    this.uiService.showDelete(id, () => this.getAllTestClose());
  }
  showActive(id: number): void {
    this.uiService.showActive(id, () => this.getAllTestClose());
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getAllTestClose();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllTestClose();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
