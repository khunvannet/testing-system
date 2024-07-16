import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestCase, TestCaseService } from './test-case.service';
import { TestCaseUiService } from './test-case-ui.service';

@Component({
  selector: 'app-test-case-list',
  template: `
    <ng-container *ngIf="!loading; else loadingTemplate">
      <ng-container *ngIf="tests.length > 0; else noTestCase">
        <div class="table-case">
          <nz-table
            #tabletest
            nzShowSizeChanger
            [nzNoResult]="noResult"
            [nzData]="tests"
            [nzShowPagination]="false"
            [nzPageSize]="pageSize"
            [nzPageIndex]="pageIndex"
            nzSize="small"
          >
            <thead>
              <tr>
                <th class="col-header" nzWidth="50px">#</th>
                <th nzColumnKey="code" nzWidth="100px">Code</th>
                <th nzColumnKey="title" nzWidth="35%">Name</th>
                <th nzColumnKey="note" nzWidth="20%">Notes</th>
                <th nzWidth="165px"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let test of tabletest.data; let i = index">
                <td nzEllipsis>{{ (pageIndex - 1) * pageSize + i + 1 }}</td>
                <td nzEllipsis>
                  <a (click)="uiservice.showDetail()">{{ test.code }}</a>
                </td>
                <td nzEllipsis>
                  <a (click)="uiservice.showDetail()">{{ test.name }}</a>
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

        <div class="pagination">
          <nz-pagination
            nzSize="small"
            [nzPageIndex]="pageIndex"
            [nzTotal]="total"
            nzShowSizeChanger
            [nzPageSize]="pageSize"
            (nzPageIndexChange)="onPageIndexChange($event)"
            (nzPageSizeChange)="onPageSizeChange($event)"
          ></nz-pagination>
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
              <button
                nz-button
                nzType="primary"
                [disabled]="addTestForm.invalid"
              >
                <span nz-icon nzType="plus"></span> Add
              </button>
            </ng-template>
          </form>
        </div>
      </ng-container>
    </ng-container>

    <ng-template #noTestCase>
      <app-no-test-case></app-no-test-case>
    </ng-template>
    <ng-template #loadingTemplate>
      <div class="loading-container">
        <nz-spin></nz-spin>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .loading-container {
        position: relative;
        top: 40%;
        bottom: 60%;
      }
      .pagination {
        display: flex;
        justify-content: flex-end;
        margin-right: 10px;
      }
      .table-case {
        margin: 15px;
      }
      .title-menu {
        font-size: 14px;
        font-weight: bold;
        margin: -35px;
      }
      .input-add {
        max-width: 970px;
        margin-top: 20px;
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
  pageIndex = 1;
  pageSize = 10;
  total = 999; // Add this property
  noResult: string | TemplateRef<any> | undefined = 'No Test Cases Available';
  @Input() mainId: number | null = null;
  addTestForm: FormGroup;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private service: TestCaseService,
    public uiservice: TestCaseUiService,
    private cdr: ChangeDetectorRef
  ) {
    this.addTestForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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
      this.fetchTestsByMainId();
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.fetchTestsByMainId(); // Fetch the data for the new page index
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.fetchTestsByMainId(); // Fetch the data for the new page size
  }

  fetchTestsByMainId(): void {
    this.loading = true;
    if (this.mainId != null) {
      this.service.getTestByMainId(this.mainId).subscribe({
        next: (result) => {
          setTimeout(() => {
            this.tests = result;
            this.total = result.length; // Update total count
            this.cdr.markForCheck();
            this.loading = false;
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
}
