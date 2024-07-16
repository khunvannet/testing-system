import { Component } from '@angular/core';
import { TestCaseUiService } from './test-case-ui.service';
@Component({
  selector: 'app-detail-modal',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">Detail Test Case</span>
    </div>
    <div class="modal-content">
      <nz-tabset>
        <nz-tab nzTitle="Details">
          <div class="id">
            <h4>ID : L-21</h4>
            <a>
              <i
                nz-icon
                nzType="edit"
                nzTheme="outline"
                class="icon-padding"
              ></i>
              Edit
            </a>
          </div>
          <div>
            <h4>Title : <span>Title test case</span></h4>
          </div>
          <div>
            <h4>Description : <span>write about decription</span></h4>
          </div>
          <div>
            <h4>Owner :<span>Khun Vannet</span></h4>
          </div>
          <div>
            <h4>Notes : <span>write about problem</span></h4>
          </div>
          <div class="img-att">
            <h4>Attachments</h4>
            <img src="../../../assets/images/netshop.png" alt="" />
          </div>
        </nz-tab>
        <nz-tab nzTitle="Results">
          <div class="result-container">
            <div class="result">
              <span>1</span>
              <span style="margin-right: 40%;"
                >TR-2 | Test Run - 15-05-2024 <br />
                15-May-2024 | 11:30 am
              </span>
              <span>🟢Passed</span>
            </div>
            <div class="result">
              <span>2</span>
              <span style="margin-right: 40%;"
                >TR-2 | Test Run - 15-05-2024 <br />
                15-May-2024 | 11:30 am
              </span>
              <span>🟢Passed</span>
            </div>
            <div class="result">
              <span>3</span>
              <span style="margin-right: 40%;"
                >TR-2 | Test Run - 15-05-2024 <br />
                15-May-2024 | 11:30 am
              </span>
              <span>🟢Passed</span>
            </div>
            <div class="result">
              <span>4</span>
              <span style="margin-right: 40%;"
                >TR-2 | Test Run - 14-05-2024 <br />
                14-May-2024 | 10:30 am
              </span>
              <span>🟢Passed</span>
            </div>
            <div class="result">
              <span>5</span>
              <span style="margin-right: 40%;"
                >TR-2 | Test Run - 10-05-2024 <br />
                10-May-2024 | 9:30 am <br />

                <a (click)="toggleDetails()">
                  {{ showDetails ? 'Hide Details' : 'Views Details' }}
                  <span nz-icon [nzType]="showDetails ? 'up' : 'down'"></span>
                </a>
                <div *ngIf="showDetails" class="img-att">
                  <h4>Owner : <span>Khun Vannet</span></h4>
                  <img src="../../../assets/images/netshop.png" alt="" />
                  <span>Pos.jpg</span>
                </div>
              </span>
              <span>🔴Failed</span>
            </div>
          </div>
        </nz-tab>
      </nz-tabset>
    </div>
  `,
  styles: [
    `
      ::ng-deep .ant-modal-body {
        padding: 0px 20px;
      }
      .result {
        display: flex;
        justify-content: space-between;
        margin: 15px;
        font-size: 14px;
        font-weight: bold;
      }
      .result-container {
        max-height: 400px;
        overflow-y: auto;
      }
      .img-att img {
        height: 100px;
        width: 100px;
        margin-left: 10px;
        margin: 15px;
      }
      .id {
        display: flex;
        justify-content: space-between;
      }
      .title {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class DetailModalComponent {
  constructor(public uiService: TestCaseUiService) {}
  tabs = [
    {
      name: 'Details',
      disabled: false,
    },
    {
      name: 'Results',
      disabled: false,
    },
  ];
  showDetails: boolean = false;
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
