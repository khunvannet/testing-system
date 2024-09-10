import { Component, OnInit } from '@angular/core';
import { TestRunUiService } from './test-run-ui.service';

@Component({
  selector: 'app-test-run',
  template: `<nz-layout>
    <div class="content">
      <nz-content>
        <div class="tab-run">
          <nz-tabset>
            <nz-tab nzTitle="{{ 'Active Runs' | translate }}">
              <nz-content>
                <app-active-run></app-active-run>
              </nz-content>
            </nz-tab>
            <nz-tab nzTitle="{{ 'Close Runs' | translate }}">
              <nz-content>
                <app-close-run></app-close-run>
              </nz-content>
            </nz-tab>
          </nz-tabset>
        </div>
      </nz-content>
    </div>
  </nz-layout> `,
  styleUrls: ['../../../assets/scss/test_run.scss'],
})
export class TestRunComponent implements OnInit {
  constructor(public uiService: TestRunUiService) {}

  ngOnInit(): void {}
}
