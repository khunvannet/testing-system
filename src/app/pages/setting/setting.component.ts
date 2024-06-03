import { Component } from '@angular/core';

@Component({
  selector: 'app-setting',

  template: `
    <nz-layout>
      <nz-content>
        <div class="content-inline"></div>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .content-inline {
        margin: 11px;
        display: flex;
        min-height: 92vh;
        background: #fff;
        width: 98%;
      }
    `,
  ],
})
export class SettingComponent {}
