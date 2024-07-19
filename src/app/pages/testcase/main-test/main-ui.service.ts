import { Injectable, EventEmitter } from '@angular/core';
import { MainTest, MainTestService } from './main-test.service';
import { MainTestOperationComponent } from './main-test-operation.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/helper/notification.service';

@Injectable({
  providedIn: 'root',
})
export class MainUiService {
  dataChanged = new EventEmitter<MainTest>();
  dataUpdated = new Subject<MainTest>();

  constructor(
    private modalService: NzModalService,
    private service: MainTestService,
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
      nzComponentParams: {
        mode: 'add',
      },
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
      nzComponentParams: {
        mode: 'edit',
        mainTest: mainTest,
      },
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
        this.service.deleteMain(id).subscribe({
          next: (response: any) => {
            // Show success notification
            this.notificationService.successNotification(
              'Main deleted successfully!'
            );
            refreshCallback();
          },
          error: (error: any) => {
            console.error('Error deleting Main:', error);
            // Show error notification
            this.notificationService.customErrorNotification(
              'Failed to delete Main .'
            );
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
