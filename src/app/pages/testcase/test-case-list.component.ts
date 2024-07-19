import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestCase, TestCaseService } from './test-case.service';
import { TestCaseUiService } from './test-case-ui.service';
import { SessionService } from 'src/app/helper/session.service';

@Component({
  selector: 'app-test-case-list',
  template: `
    <ng-container *ngIf="searchFilter.length > 0; else noTestCase">
      <div class="table-case">
        <nz-table
          #tabletest
          nzShowSizeChanger
          [nzNoResult]="noResult"
          [nzData]="searchFilter"
          [nzPageSize]="pageSize"
          [nzPageIndex]="pageIndex"
          (nzPageIndexChange)="onPageIndexChange($event)"
          (nzPageSizeChange)="onPageSizeChange($event)"
          nzSize="small"
          [nzTotal]="total"
          nzTableLayout="fixed"
        >
          <thead>
            <tr>
              <th class="t-head" nzWidth="5%">#</th>
              <th class="t-head" nzWidth="10%">Code</th>
              <th class="t-head" nzWidth="25%">Name</th>
              <th class="t-head" nzWidth="20%">Description</th>
              <th class="t-head" nzWidth="20%">Notes</th>
              <th class="t-head" nzWidth="20%"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let test of tabletest.data; let i = index">
              <td nzEllipsis>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
              <td nzEllipsis>
                <a (click)="uiservice.showDetail()">{{ test.code }}</a>
              </td>
              <td nzEllipsis>
                {{ test.name }}
              </td>
              <td nzEllipsis>
                {{ test.description }}
              </td>
              <td nzEllipsis>{{ test.notes }}</td>
              <td class="action-buttons">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <a
                    *nzSpaceItem
                    nz-typography
                    (click)="uiservice.showEdit(test, test.mainId)"
                  >
                    <i
                      nz-icon
                      nzType="edit"
                      nzTheme="outline"
                      class="icon-padding"
                    ></i>
                    Edit
                  </a>
                  <a
                    *nzSpaceItem
                    nz-typography
                    class="delete-link"
                    (click)="deleteItem(test.id)"
                  >
                    <i
                      nz-icon
                      nzType="delete"
                      nzTheme="outline"
                      class="icon-padding"
                    ></i>
                    Delete
                  </a>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </div>

      <div class="input-add">
        <form nz-form [formGroup]="addTestForm" (ngSubmit)="onAddTest()">
          <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
            <input
              type="text"
              id="name"
              name="name"
              nz-input
              placeholder="Add new test case"
              formControlName="name"
              aria-label="Add new test case"
            />
          </nz-input-group>
          <ng-template #suffixIconButton>
            <button nz-button nzType="primary" [disabled]="addTestForm.invalid">
              <span nz-icon nzType="plus"></span> Add
            </button>
          </ng-template>
        </form>
      </div>
    </ng-container>

    <ng-template #noTestCase>
      <app-no-test-case></app-no-test-case>
    </ng-template>
  `,
  styles: [
    `
      .loading-container {
        position: relative;
        top: 40%;
        bottom: 60%;
      }

      .t-head {
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 1;
      }
      .table-case {
        margin: 15px;
        max-height: 495px;
        overflow-y: auto;
      }
      .title-menu {
        font-size: 14px;
        font-weight: bold;
        margin: -35px;
      }
      .input-add {
        max-width: 970px;
        margin-top: 40px;
        margin: 10px;
      }
      nz-header {
        background: #fff;
        border: 0.5px solid #cbe0f9;
      }
      .action-buttons {
        display: flex;
        justify-content: end;
      }
      .icon-padding {
        padding-right: 5px;
      }
      .delete-link {
        color: #f31313;
      }
    `,
  ],
})
export class TestCaseListComponent implements OnInit, OnChanges {
  tests: TestCase[] = [];
  searchFilter: TestCase[] = [];
  pageIndex = 1;
  pageSize = 10;
  total = 999;
  noResult: string | TemplateRef<any> | undefined = 'No Test Cases Available';
  @Input() mainId: number | null = null;
  @Input() searchTerm: string = '';

  addTestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: TestCaseService,
    public uiservice: TestCaseUiService,
    private cdr: ChangeDetectorRef,
    private session: SessionService
  ) {
    this.addTestForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mainId = this.session.getSession('mainId');
    this.uiservice.dataChanged.subscribe(() => {
      if (this.mainId != null) {
        this.fetchTestsByMainId();
      }
    });

    if (this.mainId != null) {
      this.fetchTestsByMainId();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainId'] && this.mainId != null) {
      this.session.setSession('mainId', this.mainId);
      this.fetchTestsByMainId();
    }
    if (changes['searchTerm']) {
      this.search();
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.fetchTestsByMainId();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.fetchTestsByMainId();
  }

  fetchTestsByMainId(): void {
    if (this.mainId != null) {
      this.service.getTestByMainId(this.mainId).subscribe({
        next: (tests) => {
          setTimeout(() => {
            this.tests = tests;
            this.total = tests.length;
            this.search();
          }, 350);
        },
        error: (err) => {
          console.error('Failed to fetch tests:', err);
        },
      });
    }
  }

  onAddTest(): void {
    if (this.addTestForm.valid) {
      const newTest: Partial<TestCase> = {
        name: this.addTestForm.value.name,
        mainId: this.mainId!,
      };

      this.service.addTest(newTest as TestCase).subscribe({
        next: (result: TestCase) => {
          this.uiservice.dataChanged.emit();
          this.addTestForm.reset();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to add test:', err);
        },
      });
    }
  }

  deleteItem(id: number): void {
    this.uiservice.showDelete(id, () => {
      this.refreshList();
    });
  }

  refreshList(): void {
    if (this.mainId !== null) {
      this.fetchTestsByMainId();
    }
  }

  search(): void {
    if (this.searchTerm) {
      this.searchFilter = this.tests.filter((test) => {
        return (
          test.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          test.code.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.searchFilter = [...this.tests];
    }
  }
}
