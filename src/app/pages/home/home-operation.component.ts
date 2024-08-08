import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Project, HomeService } from './home.service';
import { HomeUiService } from './home-ui.service';

@Component({
  selector: 'app-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add Project' : 'Edit Project' }}</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired>
            Name
          </nz-form-label>
          <nz-form-control [nzSpan]="15" nzErrorTip="Name is required">
            <input nz-input formControlName="name" id="name" required />
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
        [disabled]="!form.valid"
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
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: HomeService,
    public uiService: HomeUiService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit(): void {
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
          error: (error) => {
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
          next: (response) => {
            this.modalRef.close(response);
            this.uiService.refresher.emit();
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
          },
        });
      }
    }
  }
}
