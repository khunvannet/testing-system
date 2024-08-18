import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MainTest, MainTestService } from './main-test.service';
import { MainUiService } from './main-ui.service';
import { SessionService } from 'src/app/helper/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-list',
  template: `
    <ng-container>
      <ng-container *ngIf="main.length > 0; else noMain">
        <ul nz-menu nzMode="inline">
          <li
            *ngFor="let data of main"
            [class.active]="data.id === activeItemId"
            class="block-ordering"
          >
            <span class="move">
              <i nz-icon nzType="holder" nzTheme="outline"></i>
            </span>
            <a
              nz-menu-item
              (click)="clickItem(data.id)"
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
                  (click)="uiservice.showEdit(data)"
                >
                  <i nz-icon nzType="edit"></i>&nbsp;
                  <span class="action-text">Edit</span>
                </li>
                <li
                  class="menu-item"
                  nz-menu-item
                  style="color: red"
                  (click)="deleteItem(data.id)"
                >
                  <i nz-icon nzType="delete"></i>&nbsp;
                  <span class="action-text">Delete</span>
                </li>
              </ul>
            </nz-dropdown-menu>
          </li>
        </ul>
        <div class="btn-add">
          <button
            nz-button
            nzType="dashed"
            nzBlock
            (click)="uiservice.showAdd()"
          >
            Add
          </button>
        </div>
      </ng-container>
      <ng-template #noMain>
        <div class="btn-add">
          <button
            nz-button
            nzType="dashed"
            nzBlock
            (click)="uiservice.showAdd()"
          >
            Add
          </button>
        </div>
      </ng-template>
    </ng-container>
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
export class MainTestListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() projectId: number | null = null;
  @Input() activeItemId: number | null = null;
  @Output() mainId = new EventEmitter<number>();
  main: MainTest[] = [];
  private subscriptions = new Subscription();
  private refreshSub$!: Subscription;
  constructor(
    private service: MainTestService,
    public uiservice: MainUiService,
    private sessionService: SessionService
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
    this.service.getMain().subscribe({
      next: (data: MainTest[]) => {
        if (this.projectId) {
          this.main = data.filter((item) => item.projectId === this.projectId);
        } else {
          this.main = data;
        }
        if (this.activeItemId === null && this.main.length > 0) {
          this.clickItem(this.main[0].id);
        }
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.main = [];
        } else {
          console.error('Error fetching MainTest data:', err);
        }
      },
    });
  }

  deleteItem(id: number): void {
    this.uiservice.showDelete(id, () => {
      this.getAllMain();
    });
  }

  clickItem(id: number): void {
    this.activeItemId = id;
    this.mainId.emit(id);
    this.sessionService.setSession('activeItemId', id);
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
