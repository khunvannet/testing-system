import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { TestCase, TestCaseService } from './test-case.service';
import { Subscription } from 'rxjs';
import { TestCaseUiService } from './test-case-ui.service';
import { NotificationService } from 'src/app/helper/notification.service';

@Component({
  selector: 'app-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }} Test Case</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="form">
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
          <nz-form-control [nzSpan]="16" nzErrorTip="Name is required">
            <input nz-input formControlName="name" id="name" />
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
        *ngIf="mode === 'add'"
        [disabled]="!form.valid"
        nz-button
        nzType="primary"
        (click)="onSave()"
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

  constructor(
    private fb: FormBuilder,
    private modalInstance: NzModalRef,
    private service: TestCaseService,
    public uiService: TestCaseUiService,
    private notificationService: NotificationService,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    this.form = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
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
    this.modalInstance.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.service.addTest(this.form.value).subscribe({
        next: (result) => {
          this.modalInstance.close(result);
          this.uiService.dataChanged.emit(result);
          this.form.reset();
        },
        error: (error) => {
          console.error('Error adding TestCase:', error);
          this.notificationService.customErrorNotification(
            'Failed to add Test Case.'
          );
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  onEdit(): void {
    if (this.form.valid && this.testCase) {
      this.service.editTest(this.testCase.id, this.form.value).subscribe({
        next: (data) => {
          this.modalInstance.close(data);
          this.uiService.dataChanged.emit(data);
        },
        error: (error) => {
          console.error('Error updating TestCase:', error);
          this.notificationService.customErrorNotification(
            'Failed to update Test Case.'
          );
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
