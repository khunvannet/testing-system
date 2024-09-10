import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MainTest, MainTestService } from './main-test.service';
import { MainUiService } from './main-ui.service';

@Component({
  selector: 'app-main-list',
  template: `
    <ng-container *ngIf="main.length > 0; else noMain">
      <ul nz-menu nzMode="inline">
        <li
          *ngFor="let data of main; let i = index"
          [ngClass]="{ active: activeIndex === i }"
          class="block-ordering"
        >
          <span class="move">
            <i nz-icon nzType="holder" nzTheme="outline"></i>
          </span>
          <a
            (click)="clickItem(data.id!, i)"
            nz-menu-item
            style="margin-left: 10px;"
            >{{ data.name }}</a
          >
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
              style="font-size: 16px"
            ></i>
          </a>
          <nz-dropdown-menu #menu="nzDropdownMenu">
            <ul nz-menu nzSelectable>
              <li
                class="menu-item"
                nz-menu-item
                style="color: blue"
                (click)="uiservice.showEdit(data.id || 0, data.name!)"
              >
                <i nz-icon nzType="edit"></i>&nbsp;
                <span class="action-text">{{ 'Edit' | translate }}</span>
              </li>
              <li
                class="menu-item"
                nz-menu-item
                style="color: red"
                (click)="uiservice.showDalete(data.id || 0, data.name!)"
              >
                <i nz-icon nzType="delete"></i>&nbsp;
                <span class="action-text">{{ 'Delete' | translate }}</span>
              </li>
            </ul>
          </nz-dropdown-menu>
        </li>
      </ul>
      <div class="btn-add">
        <button nz-button nzType="dashed" nzBlock (click)="uiservice.showAdd()">
          Add
        </button>
      </div>
    </ng-container>
    <ng-template #noMain>
      <div class="btn-add">
        <button nz-button nzType="dashed" nzBlock (click)="uiservice.showAdd()">
          Add
        </button>
      </div>
    </ng-template>
  `,
  styles: [
    `
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
      .block-ordering {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-top: -8px;
        .move {
          position: absolute;
          z-index: 1000;
          font-size: 15px;
          cursor: move;
          margin-left: 10px;
        }
      }
      .block-ordering.active {
        background-color: #e6f7ff;
      }
    `,
  ],
})
export class MainTestListComponent implements OnInit, OnDestroy {
  @Input() projectId: number | null = null;
  @Output() mainId = new EventEmitter<number | null>();
  main: MainTest[] = [];
  totalCount = 0;
  param = {
    pageIndex: 1,
    pageSize: 999999,
    searchQuery: '',
  };
  activeIndex: number | null = null;
  private refreshSub$!: Subscription;

  constructor(
    private service: MainTestService,
    public uiservice: MainUiService
  ) {}

  ngOnInit(): void {
    this.getAllMain();

    this.refreshSub$ = this.uiservice.refresher.subscribe(() => {
      if (this.projectId !== null) {
        this.getAllMain();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && !changes['projectId'].isFirstChange()) {
      this.getAllMain();
    }
  }

  getAllMain(): void {
    this.service.getAll(this.param).subscribe({
      next: (response: any) => {
        if (this.projectId) {
          this.main = response.results.filter(
            (item: { projectId: number | null }) =>
              item.projectId === this.projectId
          );
        } else {
          this.main = response.results;
        }
        this.totalCount = response.totalCount;

        if (this.main.length > 0) {
          this.activeIndex = 0;
          this.clickItem(this.main[0].id!, 0);
        } else {
          this.activeIndex = null;
          this.mainId.emit(null);
        }
      },
      error: (error: any) => {
        console.error('Error Fetching Data', error);
      },
    });
  }

  clickItem(id: number, index: number): void {
    this.activeIndex = index;
    this.mainId.emit(id);
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
