import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TestOperationComponent } from './test-operation.component';
import { DetailModalComponent } from './detail-modal.component';
import { TestCase, TestCaseService } from './test-case.service';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/helper/notification.service';
import { DeleteTestComponent } from './delete-testcase.component';

@Injectable({
  providedIn: 'root',
})
export class TestCaseUiService {
  constructor(private modalService: NzModalService) {}
  refresher = new EventEmitter<void>();
  showAdd(mainId: number): void {
    this.modalService.create({
      nzContent: TestOperationComponent,
      nzData: { mainId },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 500,
      nzBodyStyle: { padding: '0 ' },
      nzComponentParams: {
        mode: 'add',
      },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(id: number, name: string, mainId: number): void {
    this.modalService.create({
      nzContent: TestOperationComponent,
      nzData: { id, name, mainId },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 500,
      nzBodyStyle: { padding: '0 ' },
      nzComponentParams: {
        mode: 'edit',
      },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showDelete(id: number, name: string) {
    this.modalService.create({
      nzContent: DeleteTestComponent,
      nzData: { id, name },
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }
  showDetail(componentId: string = ''): void {
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
