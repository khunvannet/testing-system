import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, of } from 'rxjs';
import { ProjectService } from 'src/app/helper/project-select.service';
import { MainTestService } from './main-test.service';

@Component({
  selector: 'app-main-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="mode === 'add'">{{ 'Add' | translate }} </span>
      <span *ngIf="mode === 'edit'"
        >{{ 'Edit' | translate }} {{ modal?.name }}</span
      >
    </div>
    <div class="modal-content" style="margin-top: 20px;">
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired>{{
            'Name' | translate
          }}</nz-form-label>
          <nz-form-control [nzSpan]="15" nzHasFeedback [nzErrorTip]="errorTpl">
            <input nz-input formControlName="name" type="text" id="name" />
            <ng-template #errorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">
                {{ 'Input is required!' | translate }}
              </ng-container>
              <ng-container *ngIf="control.hasError('nameExists')">
                {{ 'Name already exists!' | translate }}
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="project" nzRequired>{{
            'Project' | translate
          }}</nz-form-label>
          <nz-form-control [nzSpan]="15">
            <app-select-formain
              formControlName="projectId"
              [isDisabled]="true"
            ></app-select-formain>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button
        *ngIf="mode === 'add'"
        [disabled]="!frm.valid || nameExists"
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{ 'Add' | translate }}
      </button>
      <button
        *ngIf="mode === 'edit'"
        [disabled]="!frm.valid || nameExists"
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
      .modal-header-ellipsis {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class MainTestOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | undefined;
  @Output() refreshList = new EventEmitter<void>();
  frm!: FormGroup;
  loading = false;

  nameExists = false;
  selectedValue!: number;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: MainTestService,
    private notification: NzNotificationService,
    private projectService: ProjectService
  ) {}
  readonly modal = inject(NZ_MODAL_DATA);
  ngOnInit(): void {
    const storedId = localStorage.getItem('selectedProjectId');
    if (storedId) {
      this.selectedValue = +storedId;
    }
    this.projectService.currentProjectId$.subscribe((id) => {
      if (id) {
        this.selectedValue = id;
      }
    });
    this.initControl();
    if (this.mode === 'edit' && this.modal.id) {
      this.setFrmValue();
    }
  }
  private initControl(): void {
    this.frm = this.fb.group({
      name: ['', [Validators.required], [this.nameExistsValidator.bind(this)]],
      projectId: [this.selectedValue, Validators.required],
    });
  }
  private setFrmValue(): void {
    this.service.find(this.modal.id).subscribe({
      next: (results) => {
        this.frm.setValue({
          name: results.name,
          projectId: results.projectId || null,
        });
      },
    });
  }
  nameExistsValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const name = control.value;

    if (!name) {
      return of(null);
    }

    const id = this.mode === 'edit' ? this.modal.id : null;
    const pId = this.selectedValue;
    return this.service.mainIsExist(name, id, pId).pipe(
      map((response) => (response.exists ? { nameExists: true } : null)),
      catchError(() => of(null))
    );
  }
  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;
      const data = { ...this.frm.value };
      if (this.mode === 'add') {
        this.service.add(data).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.triggerOk();
          },
          error: (err: any) => {
            this.notification.error('Data', 'Add faild');
          },
        });
      } else if (this.mode === 'edit' && this.modal.id) {
        this.service.edit(this.modal.id, data).subscribe({
          next: () => {
            this.loading = false;
            this.modalRef.triggerOk();
          },
          error: () => {
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
