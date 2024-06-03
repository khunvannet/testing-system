import { Component } from '@angular/core';
import { TestRunUiService } from './test-run-ui.service';

@Component({
  selector: 'app-test-run',

  template: `<nz-layout>
    <div class="content">
      <nz-content>
        <div class="tab-run">
          <nz-tabset>
            <nz-tab nzTitle="Active Runs">
              <nz-header>
                <div class="header">
                  <div class="select-project">
                    <nz-select ngModel="Pos">
                      <nz-option nzValue="Pos" nzLabel="Pos"></nz-option>
                      <nz-option
                        nzValue="PosAdmin"
                        nzLabel="PosAdmin"
                      ></nz-option>
                      <nz-option
                        nzValue="Fitness"
                        nzLabel="Fitness"
                      ></nz-option>
                    </nz-select>
                  </div>
                  <div class="search">
                    <nz-input-group [nzSuffix]="suffixIconSearch">
                      <input type="text" nz-input />
                    </nz-input-group>
                    <ng-template #suffixIconSearch>
                      <span nz-icon nzType="search"></span>
                    </ng-template>
                  </div>
                  <div class="btn-run">
                    <button
                      class="create-project"
                      nz-button
                      nzType="primary"
                      (click)="uiService.showAdd()"
                    >
                      Create Test Run
                    </button>
                  </div>
                </div>
              </nz-header>
              <nz-layout>
                <nz-content>
                  <app-active-run></app-active-run>
                </nz-content>
              </nz-layout>
            </nz-tab>
            <nz-tab nzTitle="Close Runs "
              ><nz-header>
                <div class="header-close">
                  <div class="select-close">
                    <nz-select ngModel="Pos">
                      <nz-option nzValue="Pos" nzLabel="Pos"></nz-option>
                      <nz-option
                        nzValue="PosAdmin"
                        nzLabel="PosAdmin"
                      ></nz-option>
                      <nz-option
                        nzValue="Fitness"
                        nzLabel="Fitness"
                      ></nz-option>
                    </nz-select>
                  </div>
                  <div class="search-close">
                    <nz-input-group [nzSuffix]="suffixIconSearch">
                      <input type="text" nz-input />
                    </nz-input-group>
                    <ng-template #suffixIconSearch>
                      <span nz-icon nzType="search"></span>
                    </ng-template>
                  </div>
                </div>
              </nz-header>
              <nz-layout>
                <nz-content>
                  <app-close-run></app-close-run>
                </nz-content>
              </nz-layout>
            </nz-tab>
          </nz-tabset>
        </div>
      </nz-content>
    </div>
  </nz-layout>`,
  styles: [
    `
      .header-close {
        display: flex;
      }
      .header {
        display: flex;
        justify-content: space-between;
      }
      .btn-run {
        margin-right: -40px;
      }
      ::ng-deep
        .ant-select-single.ant-select-show-arrow
        .ant-select-selection-item {
        width: 200px;
      }
      .select-close {
        margin-left: -45px;
      }
      .select-project {
        margin-left: -40px;
      }
      .search-close {
        margin-left: 25px;
      }
      .search {
        margin-left: -450px;
      }
      nz-input-group {
        width: 250px;
      }
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        background: #f8f9fa;
      }
      .content {
        margin: 11px;
        display: flex;
        min-height: 92vh;
        background: #fff;
        width: 98%;
      }

      .tab-run {
        width: 100%;
        padding: 0px 20px;
      }
      @media (max-width: 575px) {
        ::ng-deep
          .ant-select-single.ant-select-show-arrow
          .ant-select-selection-item {
          width: 200px;
        }
        nz-input-group {
          width: 200px;
        }
        .search {
          margin-left: -120px;
        }
      }
      @media (min-width: 576px) and (max-width: 767px) {
        ::ng-deep
          .ant-select-single.ant-select-show-arrow
          .ant-select-selection-item {
          width: 200px;
        }
        nz-input-group {
          width: 200px;
        }
        .search {
          margin-left: -100px;
        }
      }
      @media (min-width: 768px) and (max-width: 991px) {
        ::ng-deep
          .ant-select-single.ant-select-show-arrow
          .ant-select-selection-item {
          width: 200px;
        }
        nz-input-group {
          width: 200px;
        }
        .search {
          margin-left: -120px;
        }
      }
      @media (min-width: 992px) and (max-width: 1300px) {
        ::ng-deep
          .ant-select-single.ant-select-show-arrow
          .ant-select-selection-item {
          width: 200px;
        }
        nz-input-group {
          width: 250px;
        }
        .search {
          margin-left: 10px;
          margin-right: 60px;
        }
      }
      @media (min-width: 1301px) and (max-width: 1499px) {
        ::ng-deep
          .ant-select-single.ant-select-show-arrow
          .ant-select-selection-item {
          width: 200px;
        }
        nz-input-group {
          width: 250px;
        }
        .search {
          margin-left: 5px;
          margin-right: 350px;
        }
      }
      @media (min-width: 1499px) and (max-width: 1699px) {
        .search {
          margin-right: 80px;
        }
      }
    `,
  ],
})
export class TestRunComponent {
  constructor(public uiService: TestRunUiService) {}
}
