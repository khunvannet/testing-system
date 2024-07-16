import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-result',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">Add Result</span>
    </div>
    <div class="modal-content" style="margin-top:10px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzFor="result" nzRequired
            >Result</nz-form-label
          >
          <nz-form-control [nzSpan]="5">
            <nz-select formControlName="result" nzShowSearch ngModel="Pending">
              <nz-option nzLabel="Passed" nzValue="Passed"></nz-option>
              <nz-option nzLabel="Failed" nzValue="Failed"></nz-option>
              <nz-option nzLabel="Pending" nzValue="Pending"></nz-option>
            </nz-select>
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
          <nz-form-label [nzSpan]="6" nzFor="attachments"
            >Attachments</nz-form-label
          >
          <nz-form-control [nzSpan]="14">
            <nz-upload
              nzName="file"
              [(nzFileList)]="files"
              [nzTransformFile]="transformFile"
              [nzData]="getExtraData"
              [nzAction]="mockOSSData.host"
              (nzChange)="onChange($event)"
            >
              <button nz-button>
                <span nz-icon nzType="upload"></span>Upload File
              </button>
            </nz-upload>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div>
        <button nz-button nzType="primary">Result</button>
        <button nz-button nzType="default" (click)="onCancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep .ant-input-disabled,
      .ant-input[disabled] {
        width: 526px;
      }
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
export class RunResultsComponent {
  form!: FormGroup<any>;
  files: NzUploadFile[] = [];
  mockOSSData = {
    dir: 'user-dir/',
    expire: '1577811661',
    host: '//www.mocky.io/v2/5cc8019d300000980a055e76',
    accessId: 'c2hhb2RhaG9uZw==',
    policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
    signature: 'ZGFob25nc2hhbw==',
  };

  constructor(private fb: FormBuilder, private modalInstance: NzModalRef) {
    this.form = this.fb.group({
      result: ['', Validators.required],
      description: [''],
      attachments: [''],
    });
  }

  onCancel(): void {
    this.modalInstance.close();
  }
  transformFile = (file: NzUploadFile): NzUploadFile => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = this.mockOSSData.dir + filename;
    return file;
  };

  getExtraData = (file: NzUploadFile): {} => {
    const { accessId, policy, signature } = this.mockOSSData;
    return {
      key: file.url,
      OSSAccessKeyId: accessId,
      policy,
      Signature: signature,
    };
  };
  onChange(e: NzUploadChangeParam): void {
    console.log('Aliyun OSS:', e.fileList);
  }
}
