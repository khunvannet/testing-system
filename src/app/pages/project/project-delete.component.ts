import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CustomValidators } from 'src/app/helper/customValidators';
import { HomeUiService } from './project-ui.service';
import { HomeService, Project } from './project.service';

@Component({
  selector: 'app-delete-pro',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ 'Delete' | translate }} {{ model.name }} </span>
    </div>
    <div class="modal-content">
      <nz-spin
        *ngIf="loading"
        style="position: absolute; top: 50%; left: 50%"
      ></nz-spin>
      <div
        *ngIf="msg && !loading"
        nz-row
        nzJustify="center"
        style="margin:2px 0 ; margin-bottom: 35px;"
      >
        <span nz-typography nzType="danger" style="position: absolute">{{
          msg | translate
        }}</span>
      </div>
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
        *ngIf="!isInused"
        nz-button
        [disabled]="!frm.valid"
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
        style="background-color: red; color: white"
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
    `,
  ],
})
export class DeleteProjectComponent implements OnInit {
  @Output() refreshList = new EventEmitter<Project>();
  frm!: FormGroup;
  loading = false;
  readonly modal = inject(NZ_MODAL_DATA);
  model: Project = {};
  isInused = false;
  msg = '';
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: HomeService,
    public uiService: HomeUiService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.modal.id) {
      this.checkProjectInUse();
      this.setFrmValue();
    }
  }
  private checkProjectInUse(): void {
    this.service.inused(this.modal.id).subscribe({
      next: (response) => {
        this.isInused = !response.can;
        this.msg = response.message;
      },
      error: () => {
        this.notification.error('Error', 'Error checking if project is in use');
      },
    });
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
        this.model = results;
        this.frm.setValue({
          name: results.name,
          note: '',
        });
      },
    });
  }

  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;
      const data = { id: this.modal.id, note: this.frm.value.note };

      this.service.delete(this.modal.id, data).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.triggerOk();
        },
        error: () => {
          this.loading = false;
          this.notification.error('Error', 'Error deleting the project');
        },
      });
    }
  }

  onCancel(): void {
    this.modalRef.close();
  }
}
