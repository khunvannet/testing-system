import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { TestRunUiService } from '../test-run-ui.service';
import { TestRun, TestRunService } from '../test-run.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-run',
  template: `
    <ng-container *ngIf="!loading; else loadingTemplate">
      <ng-container *ngIf="testRun.length > 0; else noTestRun">
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
          >
            <thead>
              <tr>
                <th nzWidth="5%">#</th>
                <th nzWidth="10%">Code</th>
                <th nzWidth="25%">Name</th>
                <th nzWidth="10%">No of test</th>
                <th nzWidth="30%">Description</th>
                <th nzWidth="20%"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of testRun; let i = index">
                <td nzEllipsis>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
                <td nzEllipsis>
                  <a routerLink="/test/test_run/run">{{ data.code }} </a>
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
                      (click)="uiService.showEdit(data, data.projectId)"
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
                      style="color: green;"
                      (click)="showClose(data.id)"
                    >
                      <span
                        nz-icon
                        nzType="issues-close"
                        nzTheme="outline"
                      ></span>
                      Close
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
                      Delete
                    </a>
                  </nz-space>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </div>
      </ng-container>
    </ng-container>
    <ng-template #noTestRun>
      <h1>Add New TestRun</h1>
    </ng-template>
    <ng-template #loadingTemplate>
      <nz-spin class="loading-spinner"></nz-spin>
    </ng-template>
  `,
  styles: [
    `
      .action-buttons {
        display: flex;
        justify-content: end;
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
      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
      }
    `,
  ],
})
export class ActiveRunListComponent implements OnInit, OnDestroy {
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
    this.getAllTestRun();
    this.refreshSub$ = this.uiService.refresher.subscribe(() => {
      this.getAllTestRun();
    });
    this.subscriptions.add(this.refreshSub$);
  }

  ngOnChanges(): void {
    this.getAllTestRun();
  }

  getAllTestRun(): void {
    this.loading = true;
    this.service
      .getTestRun(
        this.pageIndex,
        this.pageSize,
        this.searchTerm,
        this.selectedProjectId
      )
      .subscribe({
        next: (data) => {
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
        error: (err) => {
          console.error('Failed to fetch test runs', err);
          this.loading = false;
        },
      });
  }
  deleteRun(id: number): void {
    this.uiService.showDelete(id, () => this.getAllTestRun());
  }
  showClose(id: number): void {
    this.uiService.showClose(id, () => this.getAllTestRun());
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getAllTestRun();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllTestRun();
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
