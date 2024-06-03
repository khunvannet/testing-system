import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestCase, TestCaseService } from './test-case.service';
import { TestCaseStateService } from 'src/app/helper/testcasestate.service';
import { TestCaseUiService } from './test-case-ui.service';

@Component({
  selector: 'app-test-case-list',
  template: `
    <ng-container *ngIf="tests.length > 0; else noTestCase">
      <div class="table-case">
        <nz-table
          [nzNoResult]="noResult"
          [nzData]="tests"
          [nzShowPagination]="true"
          nzSize="small"
        >
          <thead>
            <tr>
              <th class="col-header" nzWidth="50px">#</th>
              <th nzColumnKey="code" nzWidth="100px">Code</th>
              <th nzColumnKey="title" nzWidth="35%">Title</th>
              <th nzColumnKey="owner" nzWidth="20%">Owner</th>
              <th nzWidth="165px"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let test of tests; let i = index">
              <td nzEllipsis>{{ i + 1 }}</td>
              <td nzEllipsis>
                <a (click)="this.uiSerive.showDetail()">{{ test.code }}</a>
              </td>
              <td nzEllipsis>
                <a (click)="this.uiSerive.showDetail()">{{ test.title }}</a>
              </td>
              <td nzEllipsis>{{ test.owner }}</td>
              <td class="action-buttons">
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <a
                    *nzSpaceItem
                    nz-typography
                    (click)="this.uiSerive.showEdit()"
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
                    (click)="deleteTestCase(i)"
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
        <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
          <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
            <input
              type="text"
              id="title"
              name="title"
              nz-input
              placeholder="Add new test case"
              formControlName="title"
            />
          </nz-input-group>
          <ng-template #suffixIconButton>
            <button nz-button nzType="primary" [disabled]="!form.valid">
              <span nz-icon nzType="plus"></span> Add
            </button>
          </ng-template>
        </form>
      </div>
    </ng-container>
    <ng-template #noTestCase>
      <app-no-test-case
        (testCaseAdded)="onTestCaseAdded($event)"
      ></app-no-test-case>
    </ng-template>
  `,
  styles: [
    `
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
export class TestCaseListComponent implements OnInit {
  tests: TestCase[] = [];
  noResult: string | TemplateRef<any> | undefined = 'No Test Cases Available';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private testCaseStateService: TestCaseStateService,
    public uiSerive: TestCaseUiService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.testCaseStateService.testCases$.subscribe({
      next: (tests: TestCase[]) => {
        this.tests = tests;
      },
      error: (err: any) => {
        console.error('Error fetching test cases:', err);
        this.noResult = 'Error loading test cases';
      },
    });
  }

  onTestCaseAdded(newTestCase: string): void {
    const newTest: TestCase = {
      id: this.generateUniqueId(),
      code: this.generateUniqueCode(),
      title: newTestCase,
      description: '',
      owner: 'Khun Vannet',
      note: '',
      attachment: '',
      result: [],
    };
    this.testCaseStateService.addTestCase(newTest);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newTestCaseTitle = this.form.value.title;
      const newTest: TestCase = {
        id: this.generateUniqueId(),
        code: this.generateUniqueCode(),
        title: newTestCaseTitle,
        description: '',
        owner: 'Khun Vannet',
        note: '',
        attachment: '',
        result: [],
      };
      this.testCaseStateService.addTestCase(newTest);
      this.form.reset();
    }
  }

  deleteTestCase(index: number): void {
    this.tests.splice(index, 1);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateUniqueCode(): number {
    // Logic to generate a unique code. This can be customized.
    return Math.floor(Math.random() * 10000);
  }
}
