import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Project, HomeService } from './home.service';
import { NotificationService } from 'src/app/helper/notification.service';

@Component({
  selector: 'app-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="form" onsubmit="">
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
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() project: Project | undefined;
  @Output() refreshList = new EventEmitter<void>();
  form: FormGroup;
  modalInstance: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private homeService: HomeService,
    private notificationService: NotificationService
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
            this.homeService.addProject(formData).subscribe({
              next: (response) => {
                this.modalInstance.close(response);
                this.form.reset();

                // Show success notification
                this.notificationService.successNotification(
                  'Project added successfully!'
                );
                this.refreshList.emit();
              },
              error: (error) => {
                console.error('Error adding project:', error);
                // Show error notification
                this.notificationService.customErrorNotification(
                  'Failed to add project.'
                );
              },
            });
          },
          error: (err: any) => {
            console.error('Error fetching projects:', err);
            // Show error notification
            this.notificationService.customErrorNotification(
              'Failed to fetch projects.'
            );
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

            // Show success notification
            this.notificationService.successNotification(
              'Project updated successfully!'
            );
            this.refreshList.emit();
          },
          error: (error) => {
            console.error('Error updating project:', error);
            // Show error notification
            this.notificationService.customErrorNotification(
              'Failed to update project.'
            );
          },
        });
    }
  }
}
