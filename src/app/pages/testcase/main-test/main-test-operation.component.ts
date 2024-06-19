import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ChangeDetectorRef } from '@angular/core';
import { MainTest, MainTestService } from './main-test.service';

@Component({
  selector: 'app-main-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:10px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="5" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="5" nzFor="project">Project</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-select
              ngModel="Pos"
              formControlName="project"
              [nzDisabled]="true"
            >
              <nz-option nzValue="Pos" nzLabel="Pos"></nz-option>
              <nz-option nzValue="PosAdmin" nzLabel="PosAdmin"></nz-option>
              <nz-option nzValue="Fitness" nzLabel="Fitness"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div>
        <button *ngIf="mode === 'edit'" nz-button nzType="primary">Edit</button>
        <button *ngIf="mode === 'add'" nz-button nzType="primary">Add</button>
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
      ::ng-deep
        .ant-select-disabled.ant-select:not(.ant-select-customize-input)
        .ant-select-selector {
        width: 270px;
      }
    `,
  ],
})
export class MainTestOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() mainTest: MainTest | undefined;
  form!: FormGroup;

  constructor(private fb: FormBuilder, private modalInstance: NzModalRef) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      project: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.mainTest) {
      this.form.patchValue({
        name: this.mainTest.name,
      });
    }
  }

  onCancel(): void {
    this.modalInstance.close();
  }
}
