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
import { Project, HomeService } from './home.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/helper/customValidators';
@Component({
  selector: 'app-operation',
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
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired>
            {{ 'Name' | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="15" nzHasFeedback>
            <input nz-input formControlName="name" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="description">
            {{ 'Description' | translate }}
          </nz-form-label>
          <nz-form-control [nzSpan]="15">
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
export class OperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() refreshList = new EventEmitter<Project>();
  frm!: FormGroup;
  loading = false;
  autoTips = CustomValidators.autoTips;
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: HomeService,
    private notification: NzNotificationService
  ) {}
  readonly modal = inject(NZ_MODAL_DATA);
  ngOnInit(): void {
    this.initControl();
    if (this.mode === 'edit' && this.modal.id) {
      this.setFrmValue();
    }
  }
  private initControl(): void {
    const { required, nameExistValidator } = CustomValidators;
    this.frm = this.fb.group({
      name: [
        null,
        [required],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      description: [null],
    });
  }
  private setFrmValue(): void {
    this.service.find(this.modal.id).subscribe({
      next: (results) => {
        this.frm.setValue({
          name: results.name,
          description: results.description || null,
        });
      },
    });
  }
  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;
      const data = { ...this.frm.getRawValue() };

      if (this.mode === 'add') {
        this.service.add(data).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.triggerOk();
          },
          error: (err: any) => {
            this.loading = false;
            console.error('Add failed', err);
            this.notification.error('Data', 'Add failed');
          },
        });
      } else if (this.mode === 'edit' && this.modal.id) {
        const editData = { ...data, id: this.modal.id };
        this.service.edit(this.modal.id, editData).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.triggerOk();
          },
          error: (err) => {
            this.loading = false;
            console.error('Edit failed', err);
            this.notification.error('Data', 'Edit failed');
          },
        });
      }
    }
  }

  onCancel(): void {
    this.modalRef.close();
  }
}
