import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Project, HomeService } from './home.service';

@Component({
  selector: 'app-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="form">
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
      <div>
        <button
          *ngIf="mode === 'add'"
          [disabled]="!form.valid"
          nz-button
          nzType="primary"
          (click)="onAdd()"
        >
          Add
        </button>

        <button
          *ngIf="mode === 'edit'"
          nz-button
          nzType="primary"
          (click)="onEdit()"
        >
          Edit
        </button>
        <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      </div>
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
    `,
  ],
})
export class OperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() project: Project | null = null;
  @Output() refreshList = new EventEmitter<Project>();
  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private homeService: HomeService
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

  closeModal(): void {
    this.modalRef.close();
    this.form.reset();
  }

  onCancel(): void {
    this.closeModal();
  }

  onAdd(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.homeService.addProject(formData).subscribe({
        next: (newProject) => {
          this.modalRef.close(newProject);
          this.form.reset();
          this.refreshList.emit(newProject);
        },
        error: (error) => {
          console.error('Error adding project:', error);
          this.errorMessage = 'Failed to add project. Please try again.';
        },
      });
    }
  }

  onEdit(): void {
    if (this.form.valid && this.project) {
      const formData = this.form.value;
      const updatedProject: Project = {
        ...this.project,
        name: formData.name,
        description: formData.description,
      };

      this.homeService
        .updateProject(this.project.id, updatedProject)
        .subscribe({
          next: (response) => {
            this.modalRef.close(response);
            this.refreshList.emit(response);
          },
          error: (error) => {
            console.error('Error updating project:', error);
            this.errorMessage = 'Failed to update project. Please try again.';
          },
        });
    }
  }
}
