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
    <div class="modal-content">
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
      >
        <nz-tabset>
          <nz-tab nzTitle="General">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzFor="code" nzRequired>
                {{ ' Code' | translate }}
              </nz-form-label>
              <nz-form-control [nzSpan]="16" nzHasFeedback>
                <input
                  nz-input
                  formControlName="code"
                  type="text"
                  id="code"
                  placeholder="New Code"
                />
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
          </nz-tab>
          <nz-tab nzTitle="Tree">
            <nz-form-item>
              <nz-form-label [nzSpan]="3" nzFor="testId" nzRequired
                >Test ID</nz-form-label
              >
              <nz-form-control [nzSpan]="16" class="tree">
                <app-tree-select
                  [projectId]="projectId"
                  formControlName="testId"
                  (treeSelectionChanged)="onTreeSelectionChange($event)"
                ></app-tree-select>
              </nz-form-control>
            </nz-form-item>
          </nz-tab>
        </nz-tabset>
      </form>
    </div>
    <div *nzModalFooter>
      <button
        nz-button
        nzType="primary"
        [disabled]="!frm.valid"
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
      .tree {
        max-height: 350px; // Adjusted height for smaller overflow
        overflow-y: auto;
      }
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
  selectedTreeNodes: any[] = [];
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
    const { required, codeExistValidator } = CustomValidators;
    this.frm = this.fb.group({
      code: [
        { value: '', disabled: true },
        [required],
        [codeExistValidator(this.service, this.modal?.id)],
      ],
      name: [null, [required]],
      projectId: [{ value: this.modal?.projectId, disabled: true }, [required]],
      description: [null],
      testId: [null, [required]],
    });
  }

  private setFrmValue(): void {
    this.service.find(this.modal.id).subscribe({
      next: (results) => {
        this.frm.setValue({
          code: results.code,
          name: results.name,
          projectId: results.projectId,
          description: results.description,
          testId: results.testId,
        });
      },
    });
  }

  onSubmit(): void {
    if (this.frm.invalid) {
      return;
    }
    this.loading = true;
    const payload = {
      ...this.frm.getRawValue(),
      testId: this.selectedTreeNodes, // Add the selected tree nodes to the payload
      id: this.modal?.id || null,
    };
    const request$ =
      this.mode === 'add'
        ? this.service.add(payload)
        : this.service.edit(this.modal.id, payload);
    request$.subscribe({
      next: () => {
        this.loading = false;
        this.modalRef.triggerOk();
        this.modalRef.close(true);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onTreeSelectionChange(nodes: any[]): void {
    this.selectedTreeNodes = nodes;
    this.frm.patchValue({ testId: nodes });
  }

  onChange(projectId: number): void {
    this.projectId = projectId;
  }

  onCancel(): void {
    this.modalRef.close();
  }
}
