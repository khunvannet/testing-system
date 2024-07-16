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

@Component({
  selector: 'app-main-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top: 10px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="14" nzErrorTip="Name is required">
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="project">Project</nz-form-label>
          <nz-form-control [nzSpan]="14" nzErrorTip="Project is required">
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
      .title {
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
    public uiservice: MainUiService
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
        },
        error: (error) => {
          console.error('Error adding MainTest:', error);
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
          this.uiservice.dataChanged.emit(data); // Emit updated item
        },
        error: (error) => {
          console.error('Error updating MainTest:', error);
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
