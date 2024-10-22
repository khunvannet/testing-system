import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { CustomValidators } from 'src/app/helper/customValidators';
import { TestRunService } from '../test-run.service';

@Component({
  selector: 'app-run-again',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ 'Run Again' | translate }} </span>
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
        {{ 'Run Again' | translate }}
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
export class RunAgainComponent implements OnInit {
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
        console.log(results.name);
      },
    });
  }
  onSubmit() {
    if (this.frm.valid) {
      this.loading = true;
      const data = { id: this.modal.id, note: this.frm.value.note };

      this.service.clone(this.modal.id, data).subscribe({
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
