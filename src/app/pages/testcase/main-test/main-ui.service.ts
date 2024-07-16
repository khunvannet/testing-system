import { Injectable, EventEmitter } from '@angular/core';
import { MainTest, MainTestService } from './main-test.service';
import { MainTestOperationComponent } from './main-test-operation.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MainUiService {
  dataChanged = new EventEmitter<MainTest>();
  dataUpdated = new Subject<MainTest>();

  constructor(
    private modalService: NzModalService,
    private service: MainTestService,
    private sanitizer: DomSanitizer
  ) {}

  showEdit(mainTest: MainTest): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 450,
      nzComponentParams: {
        mode: 'edit',
        mainTest: mainTest,
      },
    });
  }

  showAdd(): void {
    this.modalService.create({
      nzContent: MainTestOperationComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 450,
      nzComponentParams: {
        mode: 'add',
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
}
