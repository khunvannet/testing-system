import { Component, OnInit } from '@angular/core';
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
                    <app-selection
                      (selectedProjectId)="onProjectSelected($event)"
                    ></app-selection>
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
                      (click)="uiService.showAdd(selectedProjectId)"
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
            <nz-tab nzTitle="Close Runs">
              <nz-header>
                <div class="header-close">
                  <div class="select-close">
                    <app-selection
                      (selectedProjectId)="onProjectSelected($event)"
                    ></app-selection>
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
  styleUrls: ['../../../assets/scss/test_run.scss'],
})
export class TestRunComponent implements OnInit {
  selectedProjectId: number | null = null;

  constructor(public uiService: TestRunUiService) {}

  ngOnInit(): void {}

  onProjectSelected(projectId: number | null): void {
    this.selectedProjectId = projectId;
  }
}
