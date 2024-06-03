import { Component } from '@angular/core';

@Component({
  selector: 'app-main-test',

  template: `
    <div class="select-project">
      <nz-select ngModel="Pos">
        <nz-option nzValue="Pos" nzLabel="Pos"></nz-option>
        <nz-option nzValue="PosAdmin" nzLabel="PosAdmin"></nz-option>
        <nz-option nzValue="Fitness" nzLabel="Fitness"></nz-option>
      </nz-select>
    </div>
    <div>
      <app-main-list></app-main-list>
    </div>
  `,
  styles: [
    `
      ::ng-deep
        .ant-select-single.ant-select-show-arrow
        .ant-select-selection-item {
        width: 210px;
      }
      .select-project {
        margin: 10px;
        margin-top: 17px;
        width: 100px;
      }
    `,
  ],
})
export class MainTestComponent {}
