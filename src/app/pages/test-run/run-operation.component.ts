import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TestRun, TestRunService } from './test-run.service';
import { TestCase } from '../testcase/test-case.service';
import { TestRunUiService } from './test-run-ui.service';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-run-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:20px;">
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
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
          <nz-form-control [nzSpan]="16" nzHasFeedback [nzErrorTip]="errorTpl">
            <input nz-input formControlName="name" type="text" id="name" />
            <ng-template #errorTpl let-control>
              <ng-container *ngIf="control.hasError('required')"
                >Name is required</ng-container
              >
              <ng-container *ngIf="control.hasError('nameExists')"
                >Name already exists</ng-container
              >
            </ng-template>
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
      <button
        [disabled]="!form.valid"
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{ mode === 'add' ? 'Add' : 'Edit' }}
      </button>
      <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
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
export class RunOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() form!: FormGroup;
  @Input() testRun?: TestRun;
  @Output() refreshList = new EventEmitter<void>();
  projectId: number | null = null;
  loading = false;
  nameExists = false;

  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private service: TestRunService,
    public uiService: TestRunUiService
  ) {
    this.form = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', [Validators.required], [this.nameExistsValidator.bind(this)]],
      projectId: [data.projectId, Validators.required],
      testcase: this.fb.array([], Validators.required),
      description: [''],
      active: [true],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.testRun) {
      this.form.patchValue({
        code: this.testRun.code,
        name: this.testRun.name,
        projectId: this.testRun.projectId,
        description: this.testRun.description,
        active: this.testRun.active,
      });
      this.onSelectedTestCases(this.testRun.testCases || []);
    }
  }

  get testcaseArray(): FormArray {
    return this.form.get('testcase') as FormArray;
  }

  onProjectChange(projectId: number | null): void {
    this.projectId = projectId;
    this.form.patchValue({ projectId });
  }

  onSelectedTestCases(selectedTestCases: TestCase[]): void {
    const formArray = this.testcaseArray;
    formArray.clear();
    selectedTestCases.forEach((testCase) => {
      formArray.push(this.fb.group(testCase));
    });
  }

  nameExistsValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const name = control.value;
    if (!name) {
      return of(null);
    }

    return this.service.isExists(name).pipe(
      map((response) => (response.exists ? { nameExists: true } : null)),
      catchError(() => of(null))
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const formData = this.form.getRawValue();
      console.log('Submitting form data:', formData);
      if (this.mode === 'add') {
        this.service.addTestRun(formData).subscribe({
          next: () => {
            this.modalRef.close(true);
            this.uiService.refresher.emit();
            this.loading = false;
            this.form.reset();
          },
          error: (err) => {
            console.error('Error adding test run:', err);
            this.loading = false;
          },
        });
      } else if (this.mode === 'edit' && this.testRun) {
        const update: TestRun = {
          ...this.testRun,
          ...formData,
        };
        console.log('Updating test run:', update);
        this.service.editTestRun(this.testRun.id, update).subscribe({
          next: () => {
            this.modalRef.close(true);
            this.uiService.refresher.emit();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error editing test run:', err);
            this.loading = false;
          },
        });
      }
    }
  }

  onCancel(): void {
    this.modalRef.close();
    this.form.reset();
  }
}
