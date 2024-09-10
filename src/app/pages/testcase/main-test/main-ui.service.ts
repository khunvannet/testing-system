import { Injectable, EventEmitter } from '@angular/core';
import { MainTest, MainTestService } from './main-test.service';
import { MainTestOperationComponent } from './main-test-operation.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from 'src/app/helper/notification.service';
import { Subject } from 'rxjs';
import { DeleteMainComponent } from './delete-main.component';

@Injectable({
  providedIn: 'root',
})
export class MainUiService {
  constructor(
    private modalService: NzModalService,
  ) {}
  refresher = new EventEmitter<void>();
  showAdd(): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
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

  showEdit(id:number,name:string): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzData:{id,name},
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
  showDalete(id:number,name:string): void {
    this.modalService.create({
      nzContent: DeleteMainComponent,
      nzData:{id,name},
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
