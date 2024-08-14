import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Project, HomeService } from './home.service';
import { HomeUiService } from './home-ui.service';

@Component({
  selector: 'app-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired>
            Name
          </nz-form-label>
          <nz-form-control [nzSpan]="15" nzHasFeedback [nzErrorTip]="errorTpl">
            <input nz-input formControlName="name" id="name" />
            <ng-template #errorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">
                Name is required
              </ng-container>
              <ng-container *ngIf="control.hasError('nameExists')">
                Name already exists
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="description">
            Description
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
        [disabled]="!form.valid || nameExists"
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{ mode === 'add' ? 'Add' : 'Edit' }}
      </button>
      <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
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
  @Input() project: Project | null = null;
  @Output() refreshList = new EventEmitter<Project>();
  form!: FormGroup;
  loading = false;
  nameExists = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: HomeService,
    public uiService: HomeUiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required], [this.nameExistsValidator.bind(this)]],
      description: [''],
    });

    if (this.mode === 'edit' && this.project) {
      this.form.patchValue({
        name: this.project.name,
        description: this.project.description,
      });
    }
  }

  onCancel(): void {
    this.modalRef.close();
    this.form.reset();
  }

  nameExistsValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const name = control.value;
    if (!name) {
      return of(null);
    }

    return this.service.isExists(name).pipe(
      map((response) => (response.exists ? { nameExists: true } : null)),
      catchError(() => of(null))
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      const formData = this.form.value;

      if (this.mode === 'add') {
        this.service.addProject(formData).subscribe({
          next: () => {
            this.modalRef.close(true);
            this.uiService.refresher.emit();
            this.loading = false;
            this.form.reset();
          },
          error: () => {
            this.loading = false;
          },
        });
      } else if (this.mode === 'edit' && this.project) {
        const updatedProject: Project = {
          ...this.project,
          name: formData.name,
          description: formData.description,
        };
        this.service.updateProject(this.project.id, updatedProject).subscribe({
          next: () => {
            this.modalRef.close(true);
            this.uiService.refresher.emit();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      }
    }
  }
}
