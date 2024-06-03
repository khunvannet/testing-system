import { Component, OnInit } from '@angular/core';
import { MainUiService } from './main-ui.service';
import { MainTest, MainTestService } from './main-test.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-main-list',
  template: `
    <ng-container *ngIf="main.length > 0; else noMain">
      <ul nz-menu nzMode="inline" class="sider-menu" cdkDropList>
        <ul cdkDrag class="block-ordering" *ngFor="let data of main">
          <span class="move"
            ><i nz-icon nzType="holder" nzTheme="outline"></i
          ></span>
          <li nz-menu-item style="margin-left:10px;">
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
            <ul nz-menu nzSelectable>
              <li
                class="menu-item"
                nz-menu-item
                style="color:blue"
                (click)="uiService.showEdit(data.id)"
              >
                <span>
                  <i nz-icon nzType="edit"></i>&nbsp;
                  <span class="action-text">Edit</span>
                </span>
              </li>
              <li
                class="menu-item"
                nz-menu-item
                style="color:red;"
                (click)="confirmDelete(data.id)"
                Call
                confirmDelete
                method
                with
                the
                item
                id
              >
                <span>
                  <i nz-icon nzType="delete"></i>&nbsp;
                  <span class="action-text"> Delete </span>
                </span>
              </li>
            </ul>
          </nz-dropdown-menu>
        </ul>
      </ul>
      <div class="btn-add">
        <button nz-button nzType="dashed" nzBlock (click)="uiService.showAdd()">
          Add
        </button>
      </div>
    </ng-container>
    <ng-template #noMain>
      <div class="btn-add">
        <button nz-button nzType="dashed" nzBlock (click)="uiService.showAdd()">
          Add
        </button>
      </div>
    </ng-template>
  `,
  styles: [
    `
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
      .block-ordering {
        .move {
          position: absolute;
          z-index: 1000;
          font-size: 15px;
          cursor: move;
          margin-left: 10px;
        }
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-top: -8px;
      }
    `,
  ],
})
export class MainTestListComponent implements OnInit {
  main: MainTest[] = [];

  constructor(
    public uiService: MainUiService,
    private mainTestService: MainTestService,
    private modal: NzModalService // Inject NzModalService for displaying modal
  ) {}

  ngOnInit(): void {
    this.refreshMainList();
  }

  refreshMainList(): void {
    this.main = this.mainTestService.getAllMainTests();
  }

  confirmDelete(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this item?',
      nzContent: '',
      nzOnOk: () => {
        this.mainTestService.deleteMainTest(id);
        this.refreshMainList();
      },
    });
  }
}