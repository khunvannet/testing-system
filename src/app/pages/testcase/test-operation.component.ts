import {
  Component,
  EventEmitter,
  Inject,
  inject,
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

@Component({
  selector: 'app-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top: 10px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="5" nzFor="code" nzRequired
            >Code</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="code" type="text" id="code" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="5" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="5" nzFor="main" nzRequired
            >Main Test</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <select-main formControlName="mainId"></select-main>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="5" nzFor="description"
            >Description</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <textarea
              rows="4"
              nz-input
              formControlName="description"
              id="description"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="5" nzFor="note">Notes</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <textarea
              rows="4"
              nz-input
              formControlName="notes"
              id="note"
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
    </div>
  `,
  styles: [
    `
      .title {
        display: block;
        text-align: center;
      }
      .modal-header-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .modal-content {
        margin-top: 10px;
      }
    `,
  ],
})
export class TestOperationComponent implements OnInit, OnDestroy {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() testCase: TestCase | undefined;
  @Input() mainId: number | undefined;
  @Output() refreshList = new EventEmitter<void>();
  form: FormGroup;
  subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private modalInstance: NzModalRef,
    private service: TestCaseService,
    public uiservice: TestCaseUiService,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    this.mainId = data.mainId;
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      notes: [''],
      mainId: [this.mainId, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.testCase) {
      this.form.patchValue({
        code: this.testCase.code,
        name: this.testCase.name,
        description: this.testCase.description,
        notes: this.testCase.notes,
        mainId: this.testCase.mainId,
      });
    }
  }

  onCancel(): void {
    this.modalInstance.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSave(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.service.addTest(formValue).subscribe({
        next: (result) => {
          this.modalInstance.close(formValue);
          console.log(result);
          this.uiservice.dataChanged.emit(result);
          this.form.reset();
        },
        error: (error) => {
          console.error('Error adding Test cast:', error);
        },
      });
    } else {
      console.error('failed to save');
    }
  }

  onEdit(): void {
    if (this.form.valid && this.testCase) {
      const formData = this.form.value;
      const updateTest: TestCase = {
        ...this.testCase,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        notes: formData.notes,
        mainId: formData.mainId,
      };
      this.service.editTest(this.testCase.id, updateTest).subscribe({
        next: (data) => {
          this.modalInstance.close(data);
          this.uiservice.dataChanged.emit(data);
        },
      });
    }
  }
}
