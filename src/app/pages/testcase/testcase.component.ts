import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestCaseUiService } from './test-case-ui.service';
import { ProjectService } from 'src/app/helper/project-select.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-testcase',
  template: `
    <nz-layout>
      <nz-content>
        <nz-layout>
          <nz-sider class="sub-sidebar" nzWidth="256px">
            <div class="select-project">
              <app-select-formain
                (pId)="onProjectSelected($event)"
              ></app-select-formain>
            </div>
            <app-main-list
              [projectId]="selectProjectId"
              (mainId)="handleMainId($event)"
            ></app-main-list>
          </nz-sider>
        </nz-layout>

        <div class="content-test">
          <app-test-case-list [mainId]="selectedMainId"></app-test-case-list>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .item-action {
        padding-left: 10px;
      }
      .select-project {
        margin: 10px;
        margin-top: 17px;
        width: 100px;
      }
      .content-test {
        width: 100%;
      }
      .sub-sidebar {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 10;
        min-height: 88vh;
        background: #fff;
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
export class TestcaseComponent implements OnInit, OnDestroy {
  selectProjectId: number | null = null;
  selectedMainId: number | null = null;
  private projectIdSubscription: Subscription | undefined;

  constructor(
    public uiService: TestCaseUiService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.selectProjectId =
      Number(localStorage.getItem('selectProjectId')) || null;
    this.projectIdSubscription =
      this.projectService.currentProjectId$.subscribe((id) => {
        if (id !== null) {
          this.selectProjectId = id;
          localStorage.setItem('selectProjectId', id.toString());
        }
      });
  }

  onProjectSelected(selectedProjectId: number) {
    this.projectService.changeProjectId(selectedProjectId);
    this.selectProjectId = selectedProjectId;
    localStorage.setItem('selectProjectId', selectedProjectId.toString());
  }

  handleMainId(mainId: number | null): void {
    this.selectedMainId = mainId;
  }

  ngOnDestroy(): void {
    if (this.projectIdSubscription) {
      this.projectIdSubscription.unsubscribe();
    }
  }
}
