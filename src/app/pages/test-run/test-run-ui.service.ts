import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { RunOperationComponent } from './test-run-operation.component';
import { EventEmitter, Injectable } from '@angular/core';
import { CloseActiveComponent } from './active-run/active-run-close.component';
import { RunAgainComponent } from './close-run/close-run-again.component';
import { DeleteRunComponent } from './active-run/active-run-delete.component';

@Injectable({
  providedIn: 'root',
})
export class TestRunUiService {
  constructor(private modalService: NzModalService) {}
  refresher = new EventEmitter<void>();
  showAdd(projectId: number): void {
    this.modalService.create({
      nzContent: RunOperationComponent,
      nzData: { projectId },
      nzFooter: null,
      nzClosable: true,
      nzWidth: 600,
      nzMaskClosable: false,
      nzBodyStyle: { height: '400px', padding: '0 10px ' },
      nzComponentParams: {
        mode: 'add',
      },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(id: number): void {
    this.modalService.create({
      nzContent: RunOperationComponent,
      nzData: { id },
      nzFooter: null,
      nzClosable: true,
      nzWidth: 500,
      nzMaskClosable: false,
      nzBodyStyle: { height: '400px', padding: '0 10px ' },
      nzComponentParams: {
        mode: 'edit',
      },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }
  showClose(id: number) {
    this.modalService.create({
      nzContent: CloseActiveComponent,
      nzData: { id },
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
  showRunAgain(id: number) {
    this.modalService.create({
      nzContent: RunAgainComponent,
      nzData: { id },
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
  showDelete(id: number) {
    this.modalService.create({
      nzContent: DeleteRunComponent,
      nzData: { id },
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
}
