import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QueryParam } from 'src/app/helper/base-api.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';
import { MainTest, MainTestService } from './main-test.service';
import { MainUiService } from './main-ui.service';

@Component({
  selector: 'app-lists-list',
  template: `
    <nz-layout>
      <nz-content>
        <nz-layout>
          <nz-sider class="sub-sidebar" nzWidth="256px">
            <div class="select-project">
              <app-select-project
                (valueChanged)="onProjectChange($event)"
              ></app-select-project>
            </div>
            <ul
              nz-menu
              nzMode="inline"
              cdkDropList
              (cdkDropListDropped)="drop($event)"
            >
              <ul
                *ngFor="let data of lists; let i = index"
                cdkDrag
                class="block-ordering"
              >
                <span
                  nz-icon
                  nzType="holder"
                  nzTheme="outline"
                  class="block-move"
                  cdkDragHandle
                ></span>
                <li
                  style="padding-left:30px"
                  nz-menu-item
                  (click)="changeMainId(data.id!)"
                  [nzSelected]="mainId === data.id!"
                >
                  {{ data.name }}
                </li>

                <a
                  [nzDropdownMenu]="menu"
                  class="action-button menu-dropdown"
                  nz-dropdown
                  nzTrigger="click"
                  nzPlacement="bottomRight"
                >
                  <i
                    nz-icon
                    nzType="ellipsis"
                    nzTheme="outline"
                    style="font-size: 22px"
                  ></i>
                </a>
                <nz-dropdown-menu #menu="nzDropdownMenu">
                  <ul nz-menu nzSelectable style="min-width: 120px;">
                    <li
                      class="menu-item"
                      nz-menu-item
                      style="color: blue; padding-left: 15px;"
                      (click)="uiservice.showEdit(data.id || 0, this.projectId)"
                    >
                      <span class="menu-item-content">
                        <i
                          nz-icon
                          nzType="edit"
                          style="margin-right: 10px;"
                        ></i>
                        <span class="action-text">{{
                          'Edit' | translate
                        }}</span>
                      </span>
                    </li>
                    <li
                      class="menu-item"
                      nz-menu-item
                      style="color: red; padding-left: 15px;"
                      (click)="uiservice.showDalete(data.id || 0)"
                    >
                      <span class="menu-item-content">
                        <i
                          nz-icon
                          nzType="delete"
                          style="margin-right: 10px;"
                        ></i>
                        <span class="action-text">{{
                          'Delete' | translate
                        }}</span>
                      </span>
                    </li>
                  </ul>
                </nz-dropdown-menu>
              </ul>
              <div class="btn-add" *ngIf="!draged">
                <button
                  nz-button
                  nzType="dashed"
                  nzBlock
                  (click)="uiservice.showAdd(this.projectId)"
                >
                  <i nz-icon nzType="plus" nzTheme="outline"></i>
                  {{ 'Add' | translate }}
                </button>
              </div>
              <div *ngIf="draged">
                <button
                  nz-button
                  nzType="primary"
                  (click)="saveOrdering()"
                  [nzLoading]="loading"
                  style="margin: 10px;width: 92%;"
                >
                  {{ 'Save' | translate }}
                </button>
              </div>
            </ul>
          </nz-sider>
        </nz-layout>
        <div class="content-test">
          <app-test-case-list
            [mainId]="mainId"
            [prId]="projectId"
          ></app-test-case-list>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .item-action {
        padding-left: 10px;
      }
      .content-test {
        min-height: 87vh;
        min-width: 1000px;
      }
      .sub-sidebar {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 10;
        background: #fff;
      }
      nz-content {
        margin: 11px;
        display: flex;
        background: #fff;
        min-width: 1000px;
      }
      ul {
        max-height: 530px;
        overflow-y: auto;
      }
      .sider-menu {
        margin-top: 30px;
      }
      .btn-add {
        width: 92%;
        margin: 10px;
      }
      .menu-dropdown {
        position: absolute;
        right: 10px;
        margin-bottom: 4px;
      }
      ::ng-deep .cdk-drag-preview {
        display: flex;
        background: rgba(0, 0, 0, 0.1);
        gap: 1em;
        align-items: center;
        padding: 0 4px;
      }
      ::ng-deep .cdk-drag-placeholder {
        opacity: 0;
      }
      .block-ordering {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-top: -8px;
      }
      .block-move {
        position: absolute;
        z-index: 1000;
        width: 35px;
        cursor: move;
        padding: 7px;
        margin-bottom: 5px;
      }
      .select-project {
        margin: 17px 10px 10px;
        width: 110px;
      }
    `,
  ],
})
export class MainTestListComponent
  extends BaseListComponent<MainTest>
  implements OnInit, OnDestroy
{
  projectId = 0;
  totalMain = 0;
  mainId = 0;
  draged = false;
  override param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };
  private refreshSub$!: Subscription;

  constructor(
    service: MainTestService,
    public uiservice: MainUiService,
    private notification: NzNotificationService
  ) {
    super(service);
  }

  override ngOnInit(): void {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    if (storedProjectId) {
      this.projectId = +storedProjectId;
      this.search();
    }
    this.refreshSub$ = this.uiservice.refresher.subscribe(() => this.search());
  }

  onProjectChange(projectId: number): void {
    this.projectId = projectId;
    localStorage.setItem('selectedProjectId', projectId.toString());
    this.search();
  }

  override search(): void {
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      const filters = [
        { field: 'projectId', operator: 'eq', value: this.projectId },
      ];
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (response: any) => {
          this.lists = response.results;
          this.mainId = this.lists.length ? this.lists[0].id! : 0;
          this.totalMain = response.param.rowCount;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }, 50);
  }

  changeMainId(id: number) {
    this.mainId = id;
  }

  saveOrdering() {
    this.loading = true;
    const newLists = this.lists.map((item, i) => ({
      ...item,
      ordering: i + 1,
    }));
    this.service.updateOrdering(newLists).subscribe(() => {
      this.loading = false;
      this.draged = false;
      this.notification.success('update-ordering', 'Successfully Saved');
    });
  }

  drop(event: CdkDragDrop<any>): void {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.draged = event.previousIndex !== event.currentIndex;
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
