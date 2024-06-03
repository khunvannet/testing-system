import { Component, TemplateRef } from '@angular/core';
import { TestRunUiService } from '../test-run-ui.service';

@Component({
  selector: 'app-active-run',
  template: ` <div class="table-case">
    <nz-table
      [nzNoResult]="noResult"
      [nzData]="activeRun"
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
        <tr *ngFor="let data of activeRun; let i = index">
          <td nzEllipsis>{{ i + 1 }}</td>
          <td nzEllipsis>{{ data.code }}</td>
          <a routerLink="/test/test_run/run"
            ><td nzEllipsis>{{ data.name }}</td></a
          >
          <td nzEllipsis>{{ data.noOfTest }}</td>
          <td class="action-buttons">
            <a
              [nzDropdownMenu]="menu"
              class="action-button menu-dropdown"
              nz-dropdown
              nzTrigger="click"
              nzPlacement="bottomRight"
            >
              <i
                nz-icon
                nzType="ellipsis"
                nzTheme="outline"
                style="font-size: 22px"
              ></i>
            </a>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu nzSelectable>
                <li
                  class="menu-item"
                  nz-menu-item
                  style="color:blue"
                  (click)="uiService.showEdit()"
                >
                  <span>
                    <i nz-icon nzType="edit"></i>&nbsp;
                    <span class="action-text">Edit</span>
                  </span>
                </li>
                <li class="menu-item" nz-menu-item style="color:blue">
                  <span>
                    <i nz-icon nzType="close"></i>&nbsp;
                    <span class="action-text">Close Run</span>
                  </span>
                </li>
                <li class="menu-item" nz-menu-item style="color:red;">
                  <span>
                    <i nz-icon nzType="delete"></i>&nbsp;
                    <span class="action-text"> Delete </span>
                  </span>
                </li>
              </ul>
            </nz-dropdown-menu>
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
      ::ng-deep .ant-table-wrapper {
        background-color: #fff;
      }
    `,
  ],
})
export class ActiveRunListComponent {
  noResult: string | TemplateRef<any> | undefined;
  activeRun: any[] = [
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

  constructor(public uiService: TestRunUiService) {}
}
