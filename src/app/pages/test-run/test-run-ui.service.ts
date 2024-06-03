import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RunOperationComponent } from './run-operation.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TestRunUiService {
  constructor(private modalService: NzModalService) {}

  showAdd(componentId: any = ''): void {
    this.modalService.create({
      nzContent: RunOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 900,
      nzMaskClosable: false,
      nzBodyStyle: { height: '530px' },
      nzComponentParams: {
        mode: 'add',
      },
    });
  }
  showEdit(componentId: any = ''): void {
    this.modalService.create({
      nzContent: RunOperationComponent,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: 900,
      nzBodyStyle: { height: '500px' },
      nzComponentParams: {
        mode: 'edit',
      },
    });
  }
}
