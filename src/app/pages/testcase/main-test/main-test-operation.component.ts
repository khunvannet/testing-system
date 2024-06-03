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
          <nz-form-label [nzSpan]="3" nzFor="name" nzRequired
            >Name</nz-form-label
          >
          <nz-form-control [nzSpan]="20">
            <input nz-input formControlName="name" type="text" id="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="3" nzFor="project">Project</nz-form-label>
          <nz-form-control [nzSpan]="20">
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
          nzType="primary"
          (click)="onSave()"
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
export class MainTestOperationComponent implements OnInit {
  @Input() id: any;
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() mainTest: MainTest | undefined;
  form!: FormGroup;
  mainItemName: string = '';

  constructor(
    private fb: FormBuilder,
    private modalInstance: NzModalRef,
    private service: MainTestService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      project: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.mainTest) {
      this.form.patchValue({
        name: this.mainTest.name,
        project: this.mainTest.project,
      });
    }
  }

  onCancel(): void {
    this.modalInstance.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const newTestCase: MainTest = {
        id: Math.floor(Math.random() * 100),
        name: this.form.value.name,
        project: this.form.value.project,
      };
      this.service.addMainTest(newTestCase);
      this.modalInstance.close();
      this.form.reset();
      this.cdr.detectChanges(); // Ensure changes are detected
    }
  }

  onEdit(): void {
    if (this.form.valid && this.mainTest) {
      const updatedTest: MainTest = {
        id: this.mainTest.id,
        name: this.form.value.name,
        project: this.form.value.project,
      };
      this.service.updateMainTest(updatedTest);
      console.log('Before modalInstance.close()');
      this.modalInstance.close();
      console.log('After modalInstance.close()');
      this.cdr.detectChanges(); // Manually trigger change detection
      this.form.reset();
    }
    console.log(this.form.value);
  }
}
