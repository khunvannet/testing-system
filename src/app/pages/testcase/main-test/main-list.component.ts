import {
  Component,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { MainTest, MainTestService } from './main-test.service';
import { MainUiService } from './main-ui.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-main-list',
  template: `
    <ng-container>
      <ng-container *ngIf="main.length > 0; else noMain">
        <ul nz-menu nzMode="inline" class="sider-menu" cdkDropList>
          <li cdkDrag class="block-ordering" *ngFor="let data of main">
            <span class="move">
              <i nz-icon nzType="holder" nzTheme="outline"></i>
            </span>
            <a
              nz-menu-item
              style="margin-left:10px;"
              (click)="clickItem(data.id)"
            >
              {{ data.name }}
            </a>
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
                  (click)="uiservice.showEdit(data)"
                >
                  <i nz-icon nzType="edit"></i>&nbsp;
                  <span class="action-text">Edit</span>
                </li>
                <li
                  class="menu-item"
                  nz-menu-item
                  style="color:red"
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
  @Input() projectId: number | null = null;
  @Output() mainId: EventEmitter<number> = new EventEmitter();
  main: MainTest[] = [];

  constructor(
    private service: MainTestService,
    public uiservice: MainUiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.projectId !== null) {
      this.getAllMain(this.projectId);
    }
    // Subscribe to data changes from service
    this.uiservice.dataChanged.subscribe((newMainTest: MainTest) => {
      if (this.projectId !== null && newMainTest.projectId === this.projectId) {
        const index = this.main.findIndex((item) => item.id === newMainTest.id);
        if (index !== -1) {
          this.main[index] = newMainTest;
        } else {
          this.main.push(newMainTest);
        }
        this.cdr.markForCheck(); // Ensure Angular runs change detection
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && this.projectId !== null) {
      this.getAllMain(this.projectId);
    }
  }

  getAllMain(projectId: number): void {
    this.service.getMainByProjectId(projectId).subscribe({
      next: (data: MainTest[]) => {
        this.main = data;
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
      this.refreshList();
    });
  }

  refreshList(): void {
    if (this.projectId !== null) {
      this.getAllMain(this.projectId);
    }
  }

  clickItem(id: number): void {
    this.mainId.emit(id);
    //console.log(id);
  }
}
