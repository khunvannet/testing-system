import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { TestCaseService } from './test-case.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/helper/customValidators';

@Component({
  selector: 'app-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="mode === 'add'">{{ 'Add' | translate }} </span>
      <span *ngIf="mode === 'edit'"
        >{{ 'Edit' | translate }} {{ modal?.name }}</span
      >
    </div>
    <div class="modal-content">
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="code" nzRequired>{{
            'Code' | translate
          }}</nz-form-label>
          <nz-form-control [nzSpan]="16" nzHasFeedback>
            <input nz-input formControlName="code" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="name" nzRequired>{{
            'Name' | translate
          }}</nz-form-label>
          <nz-form-control [nzSpan]="16" nzHasFeedback>
            <input nz-input formControlName="name" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="main" nzRequired>{{
            'Main Test' | translate
          }}</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <select-main
              formControlName="mainId"
              [isDisabled]="true"
            ></select-main>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="description">{{
            'Description' | translate
          }}</nz-form-label>
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
        *ngIf="mode === 'add'"
        [disabled]="!frm.valid"
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{ 'Add' | translate }}
      </button>
      <button
        *ngIf="mode === 'edit'"
        [disabled]="!frm.valid"
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{ 'Edit' | translate }}
      </button>
      <button nz-button nzType="default" (click)="onCancel()">
        {{ 'Cancel' | translate }}
      </button>
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
export class TestOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() refreshList = new EventEmitter<void>();
  frm!: FormGroup;
  loading = false;
  autoTips = CustomValidators.autoTips;
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: TestCaseService,
    private notification: NzNotificationService
  ) {}
  readonly modal = inject(NZ_MODAL_DATA);
  ngOnInit(): void {
    this.initControl();
    if (this.mode === 'edit' && this.modal?.id) {
      this.setFrmValue();
    }
  }
  private initControl(): void {
    const { required, nameExistValidator, codeExistValidator } =
      CustomValidators;
    this.frm = this.fb.group({
      code: [
        null,
        [required],
        [codeExistValidator(this.service, this.modal?.id, this.modal?.mainId)],
      ],
      name: [
        null,
        [required],
        [nameExistValidator(this.service, this.modal?.id, this.modal?.mainId)],
      ],
      description: [null],
      mainId: [{ value: this.modal?.mainId, disabled: true }, [required]],
    });
  }
  private setFrmValue(): void {
    this.service.find(this.modal.id).subscribe({
      next: (results) => {
        this.frm.setValue({
          code: results.code,
          name: results.name,
          description: results.description,
          mainId: results.mainId,
        });
      },
    });
  }

  onSubmit() {
    if (this.frm.valid) {
      this.loading = true;
      const data = { ...this.frm.getRawValue() };
      if (this.mode === 'add') {
        this.service.add(data).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.triggerOk();
            this.notification.success('Data', 'Add successful');
          },
          error: (err: any) => {
            this.loading = false;
            console.error('Add failed', err);
            this.notification.error('Data', 'Add faild');
          },
        });
      } else if (this.mode === 'edit' && this.modal?.id) {
        const editData = { ...data, id: this.modal.id };
        this.service.edit(this.modal?.id, editData).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.triggerOk();
            this.notification.success('Data', 'Edit successful');
          },
          error: (err) => {
            this.loading = false;
            console.error('Edit failed', err);
            this.notification.error('Data', 'edit faild');
          },
        });
      }
    }
  }
  onCancel(): void {
    this.modalRef.close();
  }
}
