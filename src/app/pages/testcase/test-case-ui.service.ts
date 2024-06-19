import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TestOperationComponent } from './test-operation.component';
import { DetailModalComponent } from './detail-modal.component';

@Injectable({
  providedIn: 'root',
})
export class TestCaseUiService {
  constructor(private modalService: NzModalService) {}
  showAdd(componentId: any = ''): void {
    this.modalService.create({
      nzContent: TestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 800,
      nzBodyStyle: { height: '550px' },
      nzComponentParams: {
        mode: 'add',
      },
    });
  }
  showEdit(componentId: any = ''): void {
    this.modalService.create({
      nzContent: TestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 950,
      nzBodyStyle: { height: '500px' },
      nzComponentParams: {
        mode: 'edit',
      },
    });
  }
  showDetail(componentId: any = ''): void {
    this.modalService.create({
      nzContent: DetailModalComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 950,
      nzBodyStyle: { height: '500px' },
    });
  }
}
