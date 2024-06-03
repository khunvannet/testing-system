import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ProjectService } from 'src/app/helper/projecttservice.service';
import { Project } from './home.service';

@Component({
  selector: 'app-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzFor="title" nzRequired>
            Project Name
          </nz-form-label>
          <nz-form-control
            [nzSpan]="14"
            nzErrorTip="Please input the project name!"
          >
            <input
              nz-input
              formControlName="title"
              id="title"
              placeholder="Input your project name"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzFor="description">
            Description
          </nz-form-label>
          <nz-form-control [nzSpan]="14">
            <textarea
              rows="4"
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
        <button nz-button nzType="primary" (click)="onSubmit()">
          {{ mode === 'add' ? 'Add' : 'Update' }}
        </button>
        <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      .title {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class OperationComponent {
  @Input() mode: 'add' | 'edit' = 'add'; // Default mode is 'add'
  @Input() project: Project | undefined; // Project data for editing

  projectForm: FormGroup;
  modalInstance: NzModalRef | undefined;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private modalRef: NzModalRef
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
    });

    if (this.mode === 'edit' && this.project) {
      this.projectForm.patchValue({
        title: this.project.title,
        description: this.project.description,
      });
    }

    this.modalInstance = this.modalRef; // Assigning modalRef to modalInstance
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const project = this.projectForm.value as Project;
      console.log('Project data:', project);

      if (this.mode === 'add') {
        this.projectService.addProject(project); // Add project to service
      } else if (this.mode === 'edit' && this.project) {
        this.projectService.updateProject(this.project.id, project); // Update project
      }

      // Close the modal in both cases
      this.closeModal();
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.close();
      // Reset the form
      this.projectForm.reset();
    }
  }

  onCancel(): void {
    this.closeModal();
  }
}
