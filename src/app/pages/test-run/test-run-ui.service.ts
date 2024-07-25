import { NzModalService } from 'ng-zorro-antd/modal';
import { RunOperationComponent } from './run-operation.component';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestRunUiService {
  constructor(private modalService: NzModalService) {}

  showAdd(projectId: number | null): void {
    this.modalService.create({
      nzContent: RunOperationComponent,
      nzData: { projectId },
      nzFooter: null,
      nzClosable: true,
      nzWidth: 500,
      nzMaskClosable: false,
      nzBodyStyle: { padding: '0 ' },
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
      nzWidth: 500,
      nzBodyStyle: { padding: '0 ' },
      nzComponentParams: {
        mode: 'edit',
      },
    });
  }
}
