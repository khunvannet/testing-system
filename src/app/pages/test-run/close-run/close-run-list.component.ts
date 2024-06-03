import { Component, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-close-run',
  template: ` <div class="table-case">
    <nz-table
      [nzNoResult]="noResult"
      [nzData]="closeRun"
      [nzShowPagination]="true"
      nzSize="small"
    >
      <thead>
        <tr>
          <th nzWidth="50px">#</th>
          <th nzColumnKey="code" nzWidth="100px">Code</th>
          <th nzColumnKey="title" nzWidth="35%">Title</th>
          <th nzWidth="100px">No of test</th>

          <th nzWidth="165px"></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of closeRun; let i = index">
          <td nzEllipsis>{{ i + 1 }}</td>
          <td nzEllipsis>{{ data.code }}</td>
          <a routerLink="/test/test_run/close"
            ><td nzEllipsis>{{ data.name }}</td></a
          >

          <td nzEllipsis>{{ data.noOfTest }}</td>

          <td class="action-buttons">
            <nz-space [nzSplit]="spaceSplit">
              <ng-template #spaceSplit>
                <nz-divider nzType="vertical"></nz-divider>
              </ng-template>
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
  </div>`,
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
    `,
  ],
})
export class CloseRunListComponent {
  noResult: string | TemplateRef<any> | undefined;
  closeRun: any[] = [
    {
      id: 1,
      code: 101,
      name: 'Test Run - 28-05-2024 ',
      noOfTest: 2,
    },
    {
      id: 2,
      code: 102,
      name: 'Test Run - 27-05-2024',
      noOfTest: 1,
    },
    {
      id: 3,
      code: 103,
      name: 'Test Run - 26-05-2024',
      noOfTest: 1,
    },
  ];
}
