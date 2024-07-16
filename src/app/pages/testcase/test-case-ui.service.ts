import { EventEmitter, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TestOperationComponent } from './test-operation.component';
import { DetailModalComponent } from './detail-modal.component';
import { TestCase, TestCaseService } from './test-case.service';
import { Subject } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TestCaseUiService {
  dataChanged = new EventEmitter<TestCase>();
  dataUpdated = new Subject<TestCase>();
  sanitizer: any;
  constructor(
    private modalService: NzModalService,
    private service: TestCaseService
  ) {}
  showAdd(mainId: any, componentId: any = ''): void {
    this.modalService.create({
      nzContent: TestOperationComponent,
      nzData: { mainId },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 800,
      nzComponentParams: {
        mode: 'add',
      },
    });
  }
  showEdit(testCase: TestCase, mainId: any, componentId: any = ''): void {
    this.modalService.create({
      nzContent: TestOperationComponent,
      nzData: { mainId },
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 950,
      nzComponentParams: {
        mode: 'edit',
        testCase: testCase,
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
          next: (response: any) => {
            refreshCallback();
          },
          error: (error: any) => {
            console.error('Error deleting Main:', error);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
  showDetail(componentId: any = ''): void {
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
