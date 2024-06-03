import { Component, OnInit } from '@angular/core';
import { RunUiService } from './run-ui.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-run',
  template: `<nz-header>
      <div class="header">
        <div style="margin-left: -30px; margin-top:5px;">
          <app-breadcrumb
            *ngIf="breadcrumbData"
            [data]="breadcrumbData"
          ></app-breadcrumb>
        </div>
        <div class="search">
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input type="text" nz-input />
          </nz-input-group>
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </div>
        <div class="select-status">
          <nz-select ngModel="Pending">
            <nz-option nzValue="All Status" nzLabel="All Status"></nz-option>
            <nz-option nzValue="Success" nzLabel="Success"></nz-option>
            <nz-option nzValue="Skip" nzLabel="Skip"></nz-option>
            <nz-option nzValue="Pending" nzLabel="Pending"></nz-option>
          </nz-select>
        </div>
      </div>
    </nz-header>
    <nz-layout>
      <nz-content>
        <div class="content-inline">
          <div class="table-case">
            <nz-table
              [nzShowPagination]="true"
              nzSize="small"
              nzNoResult="noResult"
              [nzData]="run"
            >
              <thead>
                <tr>
                  <th nzWidth="50px">#</th>
                  <th nzColumnKey="code" nzWidth="100px">Code</th>
                  <th nzColumnKey="title" nzWidth="35%">Title</th>
                  <th nzColumnKey="status" nzWidth="100px">Status</th>
                  <th nzWidth="165px"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let data of run; let i = index">
                  <td nzEllipsis>{{ i + 1 }}</td>
                  <td nzEllipsis>{{ data.code }}</td>

                  <td nzEllipsis>{{ data.name }}</td>

                  <td nzEllipsis>{{ data.result }}</td>
                  <td class="action-buttons">
                    <nz-space>
                      <button
                        nzSize="small"
                        *nzSpaceItem
                        nz-button
                        nzType="primary"
                        nzGhost
                        (click)="uiService.showUpdateResult()"
                      >
                        Test
                      </button>
                      <button
                        nzSize="small"
                        *nzSpaceItem
                        nz-button
                        nzType="primary"
                        nzGhost
                        style=" border-color:green; color:green;"
                      >
                        Skip
                      </button>
                      <button
                        nzSize="small"
                        *nzSpaceItem
                        nz-button
                        nzType="dashed"
                        nzDanger
                      >
                        Delete
                      </button>
                    </nz-space>
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </div>
        </div>
      </nz-content>
    </nz-layout>`,
  styles: [
    `
      .select-status {
        margin-left: 15px;
      }
      .action-buttons {
        display: flex;
        justify-content: end;
      }
      .delete-link {
        color: red;
      }
      .table-case {
        margin-top: 10px;
        margin: 15px;
      }
      ::ng-deep
        .ant-select-single.ant-select-show-arrow
        .ant-select-selection-item {
        width: 210px;
      }

      .search {
        margin-left: 35px;
      }
      nz-input-group {
        width: 300px;
      }
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        background: #f8f9fa;
      }
      .content-inline {
        width: 1700px;
      }
      .header {
        display: flex;
      }
      nz-content {
        margin: 11px;
        display: flex;
        min-height: 92vh;
        background: #fff;
        width: 98%;
      }
    `,
  ],
})
export class ActiveRunComponent implements OnInit {
  breadcrumbData!: Observable<any>;
  run: any[] = [
    {
      id: 1,
      code: 101,
      name: 'form required',
      noOfTest: 1,
      asigned: 'Khun Vannet',
      result: 'Pending',
    },
    {
      id: 2,
      code: 104,
      name: 'form validation',
      noOfTest: 1,
      asigned: 'Khun Vannet',
      result: 'Pending',
    },
  ];

  constructor(
    public uiService: RunUiService,
    private activated: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.breadcrumbData = this.activated.data;
  }
}
