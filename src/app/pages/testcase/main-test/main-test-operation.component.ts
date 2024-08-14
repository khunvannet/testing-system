import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MainTest, MainTestService } from './main-test.service';
import { HomeService, Project } from '../../home/home.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { MainUiService } from './main-ui.service';

@Component({
  selector: 'app-main-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top: 20px;">
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="15" nzHasFeedback [nzErrorTip]="errorTpl">
            <input nz-input formControlName="name" type="text" id="name" />
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
  loading = false;
  projects$: Observable<Project[]>;
  private subscription: Subscription = new Subscription();
  nameExists = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private homeService: HomeService,
    private projectSelectionService: ProjectSelectionService,
    private service: MainTestService,
    private uiService: MainUiService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required], [this.nameExistsValidator.bind(this)]],
      projectId: ['', Validators.required],
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
        this.service.addMain(formData).subscribe({
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
      } else if (this.mode === 'edit' && this.mainTest) {
        const update: MainTest = {
          ...this.mainTest,
          name: formData.name,
          projectId: formData.projectId,
        };
        this.service.updateMain(this.mainTest.id, update).subscribe({
          next: () => {
            this.modalRef.close(true);
            this.uiService.refresher.emit();
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
          },
        });
      }
    }
  }
}
