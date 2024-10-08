import { Injectable, EventEmitter } from '@angular/core';
import { MainTestOperationComponent } from './main-test-operation.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeleteMainComponent } from './delete-main.component';

@Injectable({
  providedIn: 'root',
})
export class MainUiService {
  constructor(private modalService: NzModalService) {}
  refresher = new EventEmitter<void>();
  showAdd(projectId: number): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzData: { projectId },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzComponentParams: { mode: 'add' },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(id: number, name: string, projectId: number): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzData: { id, name, projectId },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzComponentParams: { mode: 'edit' },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }
  showDalete(id: number, name: string): void {
    this.modalService.create({
      nzContent: DeleteMainComponent,
      nzData: { id, name },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }
}
