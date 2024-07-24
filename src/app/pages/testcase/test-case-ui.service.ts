import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TestOperationComponent } from './test-operation.component';
import { DetailModalComponent } from './detail-modal.component';
import { TestCase, TestCaseService } from './test-case.service';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/helper/notification.service';

@Injectable({
  providedIn: 'root',
})
export class TestCaseUiService {
  dataChanged = new EventEmitter<TestCase>();
  dataUpdated = new Subject<TestCase>();
  searchTerm: any;

  constructor(
    private modalService: NzModalService,
    private service: TestCaseService,
    private notificationService: NotificationService
  ) {}

  showAdd(mainId: any, componentId: string = ''): void {
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
    });
  }

  showEdit(testCase: TestCase, mainId: number, componentId: string = ''): void {
    this.modalService.create({
      nzContent: TestOperationComponent,
      nzData: { mainId },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 500,
      nzBodyStyle: { padding: '0 ' },
      nzComponentParams: {
        mode: 'edit',
        testCase,
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
        this.service.deleteTest(id).subscribe({
          next: () => {
            this.notificationService.successNotification(
              'Test case deleted successfully!'
            );
            refreshCallback();
          },
          error: (error) => {
            console.error('Error deleting test case:', error);
            this.notificationService.customErrorNotification(
              'Failed to delete test case.'
            );
          },
        });
      },
      nzCancelText: 'No',
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
