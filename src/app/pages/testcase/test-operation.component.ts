import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TestCase } from './test-case.service';
import { TestCaseStateService } from 'src/app/helper/testcasestate.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
@Component({
  selector: 'app-test-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:10px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="code" nzRequired
            >Code</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="code" type="text" id="code" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="title" nzRequired
            >Title</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <input nz-input formControlName="title" type="text" id="title" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="description"
            >Description</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <textarea
              rows="4"
              nz-input
              formControlName="description"
              id="description"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="note">Notes</nz-form-label>
          <nz-form-control [nzSpan]="14">
            <textarea
              rows="4"
              nz-input
              formControlName="note"
              id="note"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="attachments"
            >Attachments</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <div class="clearfix" sy>
              <nz-upload
                nzAction="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                nzListType="picture-card"
                [(nzFileList)]="fileList"
                [nzShowButton]="fileList.length < 8"
                [nzPreview]="handlePreview"
              >
                <div>
                  <span nz-icon nzType="plus"></span>
                  <div>Upload</div>
                </div>
              </nz-upload>
              <nz-modal
                [nzVisible]="previewVisible"
                [nzContent]="modalContent"
                [nzFooter]="null"
                (nzOnCancel)="previewVisible = false"
              >
                <ng-template #modalContent>
                  <img [src]="previewImage" [ngStyle]="{ width: '100%' }" />
                </ng-template>
              </nz-modal>
            </div>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div>
        <button nz-button nzType="primary" (click)="onSave()">
          {{ mode === 'add' ? 'Add' : 'Update' }}
        </button>
        <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      nz-upload {
        max-height: 150px;
        overflow-y: auto;
      }

      .title {
        display: block;
        text-align: center;
      }
      .preview-container {
        margin-top: 10px;
      }
      .preview-image {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border: 1px solid #d9d9d9;
        padding: 2px;
      }
    `,
  ],
})
export class TestOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() testCase: TestCase | undefined;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalInstance: NzModalRef,
    private testCaseStateService: TestCaseStateService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      owner: ['', Validators.required],
      description: [''],
      note: [''],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.testCase) {
      this.form.patchValue({
        title: this.testCase.title,
        description: this.testCase.description,
        owner: this.testCase.owner,
        note: this.testCase.note,
      });
    }
  }

  onCancel(): void {
    this.modalInstance.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const newTestCase: TestCase = {
        id: this.generateUniqueId(),
        code: this.generateUniqueCode(),
        title: this.form.value.title,
        owner: this.form.value.owner,
        description: this.form.value.description,
        note: this.form.value.note,
        attachment: '',
        result: [],
      };
      this.testCaseStateService.addTestCase(newTestCase);
      this.modalInstance.close();
      this.form.reset();
    }
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  generateUniqueCode(): number {
    return Math.floor(Math.random() * 1000000);
  }

  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
}
