import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OperationComponent } from './home-operation.component';
import { DeleteProjectComponent } from './delete-project.component';
@Injectable({
  providedIn: 'root',
})
export class HomeUiService {
  constructor(private modalService: NzModalService) {}
  refresher = new EventEmitter<void>();

  showAdd() {
    this.modalService.create({
      nzContent: OperationComponent,
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzComponentParams: {
        mode: 'add',
      },
      nzOnOk: () => {
        this.refresher.emit();
      },
    });
  }

  showEdit(id: number) {
    this.modalService.create({
      nzContent: OperationComponent,
      nzData: { id },
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
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
      nzContent: DeleteProjectComponent,
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
}
