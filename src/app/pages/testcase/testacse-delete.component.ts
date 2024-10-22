import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/helper/customValidators';
import { TestCase, TestCaseService } from './testcase-case.service';
@Component({
  selector: 'app-delete-pro',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ 'Delete' | translate }} {{ model.name }} </span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name">
            {{ 'Name' | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="15" nzHasFeedback>
            <input nz-input formControlName="name" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="notes">
            {{ 'Notes' | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="15">
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
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{ 'Delete' | translate }}
      </button>
      <button nz-button nzType="default" (click)="onCancel()">
        {{ 'Cancel' | translate }}
      </button>
    </div>
  `,
  styles: [
    `
      ::ng-deep .ant-modal-header {
        padding: 8px 10px;
      }
      .modal-content {
        padding-top: 20px;
      }
      .modal-header-ellipsis {
        display: block;
        text-align: center;
        font-size: 14px;
      }
      .error-message {
        color: red;
      }
    `,
  ],
})
export class DeleteTestComponent implements OnInit {
  @Output() refreshList = new EventEmitter<TestCase>();
  frm!: FormGroup;
  loading = false;
  model: TestCase = {};
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: TestCaseService,
    private notification: NzNotificationService
  ) {}
  readonly modal = inject(NZ_MODAL_DATA);
  ngOnInit(): void {
    this.initControl();
    if (this.modal.id) {
      this.setFrmValue();
    }
  }
  private initControl(): void {
    const { required } = CustomValidators;
    this.frm = this.fb.group({
      name: [{ value: null, disabled: true }, [required]],
      notes: [null],
    });
  }
  private setFrmValue(): void {
    this.service.find(this.modal?.id).subscribe({
      next: (results) => {
        this.model = results;
        this.frm.setValue({
          name: results.name,
          notes: results.notes || null,
        });
      },
    });
  }
  onSubmit() {
    if (this.frm.valid) {
      this.loading = true;
      const data = {
        id: this.modal.id,
        note: this.frm.value.note,
      };
      this.service.delete(this.modal.id, data).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.triggerOk();
        },
        error: () => {
          this.notification.error(
            'Error',
            'Error occurred while deleting the test'
          );
          this.loading = false;
        },
      });
    }
  }
  onCancel(): void {
    this.modalRef.close();
  }
}
