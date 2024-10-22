import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { CustomValidators } from 'src/app/helper/customValidators';
import { TestRunService } from '../test-run.service';

@Component({
  selector: 'app-close-active',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ 'Close' | translate }} </span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired>
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
              formControlName="note"
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
        [disabled]="!frm.valid"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{ 'Close' | translate }}
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
    `,
  ],
})
export class CloseActiveComponent implements OnInit {
  frm!: FormGroup;
  loading = false;
  readonly modal = inject(NZ_MODAL_DATA);
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: TestRunService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.modal.id) {
      this.setFrmValue();
    }
  }
  private initForm(): void {
    this.frm = this.fb.group({
      name: [{ value: null, disabled: true }, [CustomValidators.required]],
      note: [''],
    });
  }

  private setFrmValue(): void {
    this.service.find(this.modal.id).subscribe({
      next: (results) => {
        this.frm.setValue({
          name: results.name,
          note: '',
        });
      },
    });
  }
  onSubmit() {
    if (this.frm.valid) {
      this.loading = true;
      const data = { id: this.modal.id, note: this.frm.value.note };

      this.service.close(this.modal.id, data).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.triggerOk();
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  onCancel(): void {
    this.modalRef.close();
  }
}
