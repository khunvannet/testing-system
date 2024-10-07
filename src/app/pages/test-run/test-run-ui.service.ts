import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { RunOperationComponent } from './run-operation.component';
import { EventEmitter, Injectable } from '@angular/core';
import { CloseActiveComponent } from './active-run/close-active.component';
import { RunAgainComponent } from './close-run/run-again.component';
import { DeleteRunComponent } from './active-run/delete-run.component';

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
      nzWidth: 500,
      nzMaskClosable: false,
      nzBodyStyle: { padding: '0 ' },
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
      nzBodyStyle: { padding: '0 ' },
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
