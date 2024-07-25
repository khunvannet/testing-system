import { Component, OnInit, TemplateRef } from '@angular/core';
import { TestRunUiService } from '../test-run-ui.service';
import { TestRun, TestRunService } from '../test-run.service';

@Component({
  selector: 'app-active-run',
  template: `
    <div class="table-case">
      <nz-table
        [nzNoResult]="noResult"
        [nzData]="testRun"
        [nzShowPagination]="true"
        nzSize="small"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
        nzTableLayout="fixed"
        [nzPageSize]="pageSize"
        [nzPageIndex]="pageIndex"
        #tabletest
        nzShowSizeChanger
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
          <tr *ngFor="let data of tabletest.data; let i = index">
            <td nzEllipsis>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
            <td nzEllipsis>
              <a routerLink="/test/test_run/run">{{ data.code }} </a>
            </td>
            <td nzEllipsis>{{ data.name }}</td>
            <td nzEllipsis>{{ data.testCases.length }}</td>

            <td nzEllipsis>{{ data.description }}</td>
            <td class="action-buttons">
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <a *nzSpaceItem nz-typography (click)="uiService.showEdit()">
                  <i
                    nz-icon
                    nzType="edit"
                    nzTheme="outline"
                    class="icon-padding"
                  ></i>
                  Edit
                </a>
                <a *nzSpaceItem nz-typography style="color: green;">
                  <span nz-icon nzType="issues-close" nzTheme="outline"></span>
                  Close
                </a>
                <a *nzSpaceItem nz-typography class="delete-link">
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
    `,
  ],
})
export class ActiveRunListComponent implements OnInit {
  noResult: string | TemplateRef<any> | undefined;
  testRun: TestRun[] = [];
  pageIndex = 1;
  pageSize = 10;
  constructor(
    public uiService: TestRunUiService,
    private service: TestRunService
  ) {}

  ngOnInit(): void {
    this.getAllTestRun();
  }

  getAllTestRun(): void {
    this.service.getTestRun().subscribe({
      next: (data) => {
        this.testRun = data;
      },
      error: (err) => {
        console.error('Failed to fetch test runs', err);
      },
    });
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
  }
}
