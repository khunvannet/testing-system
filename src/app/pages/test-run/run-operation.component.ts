import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { CustomValidators } from 'src/app/helper/customValidators';
import { TestRunService } from './test-run.service';

@Component({
  selector: 'app-run-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span>{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:20px;">
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="code" nzRequired>
            Code
          </nz-form-label>
          <nz-form-control [nzSpan]="16" nzHasFeedback>
            <input nz-input formControlName="code" type="text" id="code" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="16" nzHasFeedback>
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="project" nzRequired
            >Project</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <app-select-project
              (valueChanged)="onChange($event)"
              [isDisabled]="true"
            ></app-select-project>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="project" nzRequired
            >Main Test</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <app-main-multiple-select
              [projectId]="projectId"
              (valueChanged)="onMainIdChange($event)"
              formControlName="mainId"
            ></app-main-multiple-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="testcase" nzRequired
            >Test Case</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <app-test-multiple-select
              [selectedMainIds]="mainIds"
              formControlName="testId"
            ></app-test-multiple-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="description" row="3"
            >Description</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
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
        [disabled]="frm.invalid"
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
      nz-select {
        width: 200px;
      }
      .modal-header-ellipsis {
        display: block;
        text-align: center;
        font-size: 14px;
      }
      ::ng-deep .ant-modal-header {
        padding: 8px 10px;
      }
    `,
  ],
})
export class RunOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | undefined;
  frm!: FormGroup;
  loading = false;
  projectId = 0;
  mainIds: number[] = [];
  autoTips = CustomValidators.autoTips;
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: TestRunService
  ) {}
  readonly modal = inject(NZ_MODAL_DATA);
  ngOnInit(): void {
    this.initControl();
    if (this.mode === 'edit' && this.modal.id) {
      this.setFrmValue();
    }
  }

  private initControl(): void {
    const { required, nameExistValidator, codeExistValidator } =
      CustomValidators;
    this.frm = this.fb.group({
      code: [
        null,
        [required],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [
        null,
        [required],
        [nameExistValidator(this.service, this.modal?.id)],
      ],
      projectId: [{ value: this.modal?.projectId, disabled: true }, [required]],
      mainId: [[], [required]],
      testId: [[], [required]],
      description: [null],
    });
  }
  private setFrmValue(): void {
    this.service.find(this.modal.id).subscribe({
      next: (results) => {
        this.frm.setValue({
          code: results.code,
          name: results.name,
          description: results.description,
          mainId: results.mainId,
          testId: results.testId,
          projectId: results.projectId,
        });
        // Trigger the test case search by setting the main IDs
        this.onMainIdChange(
          Array.isArray(results.mainId) ? results.mainId : []
        );
      },
    });
  }

  onSubmit(): void {
    if (this.frm.valid) {
      this.loading = true;
      const data = { ...this.frm.getRawValue() };
      const operation =
        this.mode === 'add'
          ? this.service.add(data)
          : this.service.edit(this.modal!.id, { ...data, id: this.modal!.id });

      operation.subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.triggerOk();
        },
        error: (err: any) => {
          this.loading = false;
          console.error(`${this.mode === 'add' ? 'Add' : 'Edit'} failed`, err);
        },
      });
    }
  }
  onMainIdChange(mainIds: number[]): void {
    this.mainIds = mainIds;
  }
  onChange(projectId: number): void {
    this.projectId = projectId;
  }
  onCancel(): void {
    this.modalRef.close();
  }
}
