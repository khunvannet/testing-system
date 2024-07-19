import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MainTest, MainTestService } from './main-test.service';
import { HomeService, Project } from '../../home/home.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { Observable, Subscription } from 'rxjs';
import { MainUiService } from './main-ui.service';
import { NotificationService } from 'src/app/helper/notification.service';

@Component({
  selector: 'app-main-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top: 20px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="15" nzErrorTip="Name is required">
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="project" nzRequired
            >Project</nz-form-label
          >
          <nz-form-control [nzSpan]="15">
            <nz-select formControlName="projectId" [nzDisabled]="true">
              <nz-option
                *ngFor="let data of projects$ | async"
                [nzValue]="data.id"
                [nzLabel]="data.name"
              ></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div>
        <button
          *ngIf="mode === 'edit'"
          nz-button
          nzType="primary"
          (click)="onEdit()"
        >
          Edit
        </button>
        <button
          *ngIf="mode === 'add'"
          nz-button
          [disabled]="!form.valid"
          nzType="primary"
          (click)="onAdd()"
        >
          Add
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
      .modal-header-ellipsis {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class MainTestOperationComponent implements OnInit, OnDestroy {
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() mainTest: MainTest | undefined;
  form: FormGroup;
  @Output() refreshList = new EventEmitter<void>();
  projects$: Observable<Project[]>;
  selectedValue: number | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private modalInstance: NzModalRef,
    private service: HomeService,
    private projectSelectionService: ProjectSelectionService,
    private mainService: MainTestService,
    public uiservice: MainUiService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      projectId: [null, Validators.required],
    });
    this.projects$ = this.service.getProjects();
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.mainTest) {
      this.form.patchValue({
        name: this.mainTest.name,
        projectId: this.mainTest.projectId,
      });
    }
    this.subscription.add(
      this.projectSelectionService.selectedProject$.subscribe((project) => {
        this.selectedValue = project ? project.id : null;
        this.form.controls['projectId'].setValue(this.selectedValue);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAdd(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.mainService.addMain(formData).subscribe({
        next: (data) => {
          this.modalInstance.close(data);
          this.form.reset();
          this.uiservice.dataChanged.emit(data);
          // Show success notification
          this.notificationService.successNotification(
            'Main added successfully!'
          );
        },
        error: (error) => {
          console.error('Error adding MainTest:', error);
          // Show error notification
          this.notificationService.customErrorNotification(
            'Failed to add Main .'
          );
        },
      });
    } else {
      this.form.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  onEdit(): void {
    if (this.form.valid && this.mainTest) {
      const formData = this.form.value;
      const updatedMain: MainTest = {
        ...this.mainTest,
        name: formData.name,
        projectId: formData.projectId,
      };
      this.mainService.updateMain(this.mainTest.id, updatedMain).subscribe({
        next: (data) => {
          this.modalInstance.close(data);
          this.refreshList.emit();
          this.uiservice.dataChanged.emit(data);
          // Show success notification
          this.notificationService.successNotification(
            'Main updated successfully!'
          );
        },
        error: (error) => {
          console.error('Error updating MainTest:', error);
          // Show error notification
          this.notificationService.customErrorNotification(
            'Failed to update Main .'
          );
        },
      });
    } else {
      this.form.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
  onCancel(): void {
    this.modalInstance.close();
  }
}
