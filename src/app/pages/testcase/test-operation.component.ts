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
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { TestCase, TestCaseService } from './test-case.service';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { TestCaseUiService } from './test-case-ui.service';

@Component({
  selector: 'app-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }} Test Case</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="code">Code</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <input
              nz-input
              formControlName="code"
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
            <input nz-input formControlName="name" id="name" />
            <ng-template #errorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">
                Name is required
              </ng-container>
              <ng-container *ngIf="control.hasError('nameExists')">
                Name already exists
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="main" nzRequired
            >Main Test</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <select-main formControlName="mainId"></select-main>
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
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="notes">Notes</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <textarea
              rows="3"
              nz-input
              formControlName="notes"
              id="notes"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button
        [disabled]="!form.valid || nameExists"
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
      .modal-header-ellipsis {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .modal-content {
        padding-top: 20px;
      }
    `,
  ],
})
export class TestOperationComponent implements OnInit, OnDestroy {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() testCase?: TestCase;
  @Output() refreshList = new EventEmitter<void>();
  form: FormGroup;
  private subscription: Subscription = new Subscription();
  loading = false;
  nameExists = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: TestCaseService,
    public uiService: TestCaseUiService,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    this.form = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', [Validators.required], [this.nameExistsValidator.bind(this)]],
      description: [''],
      notes: [''],
      mainId: [data.mainId, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.testCase) {
      this.form.patchValue(this.testCase);
      this.form.get('code')?.disable();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCancel(): void {
    this.modalRef.close();
    this.form.reset();
  }

  nameExistsValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const name = control.value;
    const mainId = this.form?.get('mainId')?.value;
    if (!name || !mainId) {
      return of(null);
    }

    return this.service.isExists(name, mainId).pipe(
      map((response) => (response.exists ? { nameExists: true } : null)),
      catchError(() => of(null))
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const formData = this.form.value;
      if (this.mode === 'add') {
        this.service.addTest(formData).subscribe({
          next: () => {
            this.modalRef.close(true);
            this.uiService.refresher.emit();
            this.loading = false;
            this.form.reset();
          },
          error: () => {
            this.loading = false;
          },
        });
      } else if (this.mode == 'edit' && this.testCase) {
        const update: TestCase = {
          ...this.testCase,
          code: formData.code,
          name: formData.name,
          description: formData.description,
          notes: formData.notes,
          mainId: formData.mainId,
        };
        this.service.editTest(this.testCase.id, update).subscribe({
          next: () => {
            this.modalRef.close(true);
            this.uiService.refresher.emit();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      }
    }
  }
}
