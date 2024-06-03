import { Component } from '@angular/core';
import { TestRunUiService } from '../test-run/test-run-ui.service';
import { TestCaseUiService } from './test-case-ui.service';

@Component({
  selector: 'app-testcase',
  template: ` <nz-layout>
    <nz-content>
      <nz-layout>
        <nz-sider class="sub-sidebar" nzWidth="256px">
          <app-main-test></app-main-test>
        </nz-sider>
      </nz-layout>

      <div class="content-test">
        <nz-header>
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input type="text" nz-input />
          </nz-input-group>
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>

          <button
            (click)="this.uiService.showAdd()"
            class="create-project"
            nz-button
            nzType="primary"
          >
            Create Test Case
          </button>
        </nz-header>
        <div class="test-nav">
          <app-test-case-list></app-test-case-list>
        </div>
      </div>
    </nz-content>
  </nz-layout>`,
  styles: [
    `
      nz-input-group {
        width: 250px;
      }
      .title-menu {
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      /* testcase.component.css */
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
      }

      .content-test {
        width: 100%;
      }

      .sub-sidebar {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 10;
        min-height: 92vh;
        background: #fff;
      }
      nz-content {
        margin: 11px;
        display: flex;
        min-height: 92vh;
        background: #fff;
        width: 98%;
      }

      #text {
        color: #7d8597;
      }

      #text #get-start {
        margin-left: 60px;
      }
      @media (max-width: 575px) {
        .item-center {
          margin-top: 5%;
        }
        .input-search {
          width: 100%; /* Full width for small phones */
        }
        .large-icon {
          font-size: 20px; /* Further adjust icon size for small phones */
        }
        .text1 {
          font-size: 10px; /* Further adjust text size for small phones */
        }
        @media (max-width: 768px) {
          nz-header {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 0 16px;
            display: flex;
            align-items: center;
            background: #fff;
            width: 535px;
          }
        }
      }
    `,
  ],
})
export class TestcaseComponent {
  constructor(public uiService: TestCaseUiService) {}
}
