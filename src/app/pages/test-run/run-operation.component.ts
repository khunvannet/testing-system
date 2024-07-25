import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-run-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:20px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="code" nzRequired
            >Code</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="code" type="text" id="code" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="project" nzRequired
            >Project</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <app-selection
              (selectedProjectId)="onProjectChange($event)"
            ></app-selection>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="testcase" nzRequired
            >Test Case</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <app-tree [projectId]="projectId"></app-tree>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="description"
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
      <div>
        <button *ngIf="mode == 'add'" nz-button nzType="primary">Add</button>
        <button *ngIf="mode == 'edit'" nz-button nzType="primary">Edit</button>
        <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      nz-select {
        width: 200px;
      }
      .title {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class RunOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() form!: FormGroup;
  projectId: number | null = null;

  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalInstance: NzModalRef,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      project: ['', Validators.required],
      testcase: [[], Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {}

  onProjectChange(projectId: number | null): void {
    if (projectId !== null) {
      this.projectId = projectId;
    } else {
      this.projectId = null;
    }
  }
  onCancel(): void {
    this.modalInstance.close();
  }
}
