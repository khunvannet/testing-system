import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/helper/customValidators';
import { MainTest, MainTestService } from './main-test.service';
import { MainUiService } from './main-ui.service';

@Component({
  selector: 'app-delete-main',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ 'Delete' | translate }} {{ modal?.name }} </span>
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
        [disabled]="!frm.valid"
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
      }
      .error-message {
        color: red;
      }
    `,
  ],
})
export class DeleteMainComponent implements OnInit {
  @Output() refreshList = new EventEmitter<MainTest>();
  frm!: FormGroup;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: MainTestService,
    public uiService: MainUiService,
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
      note: [null],
    });
  }
  private setFrmValue(): void {
    this.service.find(this.modal.id).subscribe({
      next: (results) => {
        this.frm.setValue({
          name: results.name,
          note: results.note,
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
          this.notification.success('Success', 'Project deleted successfully');
        },
        error: () => {
          this.notification.error(
            'Error',
            'Error occurred while deleting the project'
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
