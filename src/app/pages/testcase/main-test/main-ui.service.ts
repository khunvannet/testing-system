import { Injectable, EventEmitter } from '@angular/core';
import { MainTest, MainTestService } from './main-test.service';
import { MainTestOperationComponent } from './main-test-operation.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from 'src/app/helper/notification.service';

@Injectable({
  providedIn: 'root',
})
export class MainUiService {
  dataChanged = new EventEmitter<MainTest>();

  constructor(
    private modalService: NzModalService,
    private mainTestService: MainTestService,
    private notificationService: NotificationService
  ) {}

  showAdd(): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzComponentParams: { mode: 'add' },
    });
  }

  showEdit(mainTest: MainTest): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzComponentParams: { mode: 'edit', mainTest },
    });
  }

  showDelete(id: number, refreshCallback: () => void): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.mainTestService.deleteMain(id).subscribe({
          next: () => {
            this.notificationService.successNotification(
              'Main deleted successfully!'
            );
            refreshCallback();
          },
          error: (error) => {
            console.error('Error deleting Main:', error);
            this.notificationService.customErrorNotification(
              'Failed to delete Main.'
            );
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
