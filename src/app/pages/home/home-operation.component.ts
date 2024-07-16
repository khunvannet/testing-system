import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Project, HomeService } from './home.service';

@Component({
  selector: 'app-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:10px;">
      <form nz-form [formGroup]="form" onsubmit="">
        <nz-form-item>
          <nz-form-label [nzSpan]="7" nzFor="name" nzRequired>
            Project Name
          </nz-form-label>
          <nz-form-control
            [nzSpan]="14"
            nzErrorTip="Please input the project name!"
          >
            <input
              nz-input
              formControlName="name"
              id="name"
              placeholder="Input your project name"
              required
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
      .title {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class OperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() project: Project | undefined;
  @Output() refreshList = new EventEmitter<void>();
  form: FormGroup;
  modalInstance: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private homeService: HomeService
  ) {
    this.modalInstance = this.modalRef;
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
    this.modalInstance.close();
    this.form.reset();
  }

  onCancel(): void {
    this.closeModal();
  }

  onAdd(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.mode === 'add') {
        this.homeService.getProjects().subscribe({
          next: (projects: Project[]) => {
            const projectNames = projects.map((project) => project.name);
            if (projectNames.includes(formData.name)) {
              alert(
                'Error adding project: Project with the same name already exists'
              );
            } else {
              this.homeService.addProject(formData).subscribe({
                next: (response) => {
                  this.modalInstance.close(response);
                  this.form.reset();
                  console.log('Project added:', response);
                  this.refreshList.emit(); // Emit event to refresh the list
                },
                error: (error) => {
                  console.error('Error adding project:', error);
                },
              });
            }
          },
          error: (err: any) => {
            console.error('Error fetching projects:', err);
          },
        });
      }
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
            this.modalInstance.close(response);
            console.log('Project updated:', response);
            this.refreshList.emit();
          },
          error: (error) => {
            console.error('Error updating project:', error);
          },
        });
    }
  }
}
