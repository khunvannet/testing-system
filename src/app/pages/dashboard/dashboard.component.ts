import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: `
    <nz-layout>
      <nz-content>
        <div class="content-inline"></div>
      </nz-content>
    </nz-layout>
    <ng-template #loadingTemplate>
      <div class="loading-container">
        <nz-spin></nz-spin>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .content-inline {
        margin: 11px;
        display: flex;
        min-height: 87vh;
        background: #fff;
        min-width: 1000px;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  loading: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}
