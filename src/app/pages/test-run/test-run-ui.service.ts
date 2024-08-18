import { NzModalService } from 'ng-zorro-antd/modal';
import { RunOperationComponent } from './run-operation.component';
import { EventEmitter, Injectable } from '@angular/core';
import { TestRun, TestRunService } from './test-run.service';

@Injectable({
  providedIn: 'root',
})
export class TestRunUiService {
  constructor(
    private modalService: NzModalService,
    private service: TestRunService
  ) {}
  refresher = new EventEmitter<void>();
  showAdd(projectId: number | null): void {
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
    });
  }

  showEdit(testRun: TestRun, projectId: number, componentId: any = ''): void {
    this.modalService.create({
      nzContent: RunOperationComponent,
      nzData: { projectId },
      nzFooter: null,
      nzClosable: true,
      nzWidth: 500,
      nzMaskClosable: false,
      nzBodyStyle: { padding: '0 ' },
      nzComponentParams: {
        mode: 'edit',
        testRun,
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
        this.service.delete(id).subscribe({
          next: (response: any) => {
            refreshCallback();
          },
          error: (error: any) => {
            console.error('Error deleting project:', error);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  showClose(id: number, refreshCallback: () => void): void {
    this.modalService.confirm({
      nzTitle: 'You want close Test Run',

      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.service.closeRun(id).subscribe({
          next: (response: any) => {
            refreshCallback();
          },
          error: (error: any) => {
            console.error('Error deleting project:', error);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
  showActive(id: number, refreshCallback: () => void): void {
    this.modalService.confirm({
      nzTitle: 'You want close Test Run',

      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.service.activeRun(id).subscribe({
          next: (response: any) => {
            refreshCallback();
          },
          error: (error: any) => {
            console.error('Error deleting project:', error);
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
