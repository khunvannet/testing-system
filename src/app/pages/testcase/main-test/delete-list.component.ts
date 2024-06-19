import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainTestService } from './main-test.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-main-delete',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">Delete</span>
    </div>
    <div class="modal-content" style="margin-top:10px;">
      <form nz-form>
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzFor="name">Name</nz-form-label>
          <nz-form-control [nzSpan]="20">
            <input
              nz-input
              formControlName="name"
              type="text"
              id="name"
              [disabled]="true"
              [value]=""
            />
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div>
        <button nz-button nzType="primary">Delete</button>
        <button nz-button nzType="default">Cancel</button>
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
export class DeleteMainOperationComponent {}
