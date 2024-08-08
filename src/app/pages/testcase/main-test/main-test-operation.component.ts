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
  @Output() refreshList = new EventEmitter<void>();
  form: FormGroup;
  projects$: Observable<Project[]>;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private modalInstance: NzModalRef,
    private homeService: HomeService,
    private projectSelectionService: ProjectSelectionService,
    private service: MainTestService,
    private uiService: MainUiService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      projectId: [null, Validators.required],
    });
    this.projects$ = this.homeService.getSelect();
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
        this.form.controls['projectId'].setValue(project ? project.id : null);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAdd(): void {
    if (this.form.valid) {
      this.service.addMain(this.form.value).subscribe({
        next: (data) => {
          this.modalInstance.close(data);
          this.uiService.refresher.emit();
          this.form.reset();
        },
        error: (error) => console.error('Error adding MainTest:', error),
      });
    } else {
      this.form.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  onEdit(): void {
    if (this.form.valid && this.mainTest) {
      const updatedMain: MainTest = { ...this.mainTest, ...this.form.value };
      this.service.updateMain(this.mainTest.id, updatedMain).subscribe({
        next: (data) => {
          this.modalInstance.close(data);
          this.refreshList.emit();
          this.uiService.refresher.emit();
        },
        error: (error) => console.error('Error updating MainTest:', error),
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
