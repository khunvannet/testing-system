import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TestRun, TestRunService } from './test-run.service';
import { TestCase } from '../testcase/test-case.service';
import { TestRunUiService } from './test-run-ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-run-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:20px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="code">Code</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <input
              nz-input
              formControlName="code"
              type="text"
              id="code"
              placeholder="New Code"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="project" nzRequired
            >Project</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <app-selection
              (selectedProjectId)="onProjectChange($event)"
            ></app-selection>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="testcase" nzRequired
            >Test Case</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <app-tree
              [projectId]="projectId"
              (selectedTestCases)="onSelectedTestCases($event)"
            ></app-tree>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="description"
            >Description</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <textarea
              rows="3"
              nz-input
              formControlName="description"
              id="description"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div>
        <button
          *ngIf="mode === 'add'"
          nz-button
          nzType="primary"
          (click)="onAdd()"
        >
          Add
        </button>
        <button
          *ngIf="mode === 'edit'"
          nz-button
          nzType="primary"
          (click)="onEdit()"
        >
          Edit
        </button>
        <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      nz-select {
        width: 200px;
      }
      .title {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class RunOperationComponent implements OnInit, OnDestroy {
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() form!: FormGroup;
  @Input() testRun?: TestRun;
  @Output() refreshList = new EventEmitter<void>();
  projectId: number | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalInstance: NzModalRef,
    private fb: FormBuilder,
    private service: TestRunService,
    public uiService: TestRunUiService
  ) {
    this.form = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      projectId: [data.projectId, Validators.required],
      testcase: this.fb.array([], Validators.required),
      description: [''],
      active: [true],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  get testcaseArray(): FormArray {
    return this.form.get('testcase') as FormArray;
  }

  onProjectChange(projectId: number | null): void {
    this.projectId = projectId;
    this.form.patchValue({ projectId: projectId });
  }

  onSelectedTestCases(selectedTestCases: TestCase[]): void {
    const formArray = this.testcaseArray;
    formArray.clear();
    selectedTestCases.forEach((testCase) => {
      formArray.push(this.fb.group(testCase));
    });
  }

  onAdd(): void {
    if (this.form.valid) {
      const newTestRun = this.form.getRawValue();

      this.service.addTestRun(newTestRun).subscribe({
        next: (data) => {
          this.modalInstance.close(data);
          this.uiService.dataChanged.emit(data);
          this.refreshList.emit();
        },
        error: (err) => {
          console.error('Error adding TestRun:', err);
          alert(`Error: ${err.message || 'Unknown error occurred'}`);
        },
      });
    } else {
      console.error('Form is not valid', this.form);
      this.logFormErrors();
    }
  }

  onEdit(): void {
    // Implement edit logic here
  }

  onCancel(): void {
    this.modalInstance.close();
  }

  logFormErrors(): void {
    for (const control in this.form.controls) {
      if (this.form.controls.hasOwnProperty(control)) {
        const formControl = this.form.get(control);
        if (formControl && formControl.invalid) {
          console.error(`${control} is invalid`, formControl.errors);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
