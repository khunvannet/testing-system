import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MainTestOperationComponent } from './main-test-operation.component';
import { DeleteMainOperationComponent } from './delete-list.component';

@Injectable({
  providedIn: 'root',
})
export class MainUiService {
  constructor(private modalService: NzModalService) {}

  showAdd(componentId: any = ''): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 550,
      nzComponentParams: {
        mode: 'add',
      },
    });
  }
  showEdit(id: number): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 550,
      nzComponentParams: {
        mode: 'edit',
        id: id,
      },
    });
  }
  showDelete(id: number): void {
    this.modalService.create({
      nzContent: DeleteMainOperationComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        id: id,
      },
      nzFooter: null,
      nzClosable: true,
      nzWidth: 550,
    });
  }
}
