import { NzModalService } from 'ng-zorro-antd/modal';
import { RunOperationComponent } from './run-operation.component';
import { EventEmitter, Injectable } from '@angular/core';
import { TestRun } from './test-run.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestRunUiService {
  dataChanged = new EventEmitter<TestRun>();
  dataUpdated = new Subject<TestRun>();
  constructor(private modalService: NzModalService) {}

  showAdd(projectId: number | null): void {
    const modal = this.modalService.create({
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

    modal.afterClose.subscribe((result: TestRun | null) => {
      if (result) {
        this.dataChanged.emit(result);
      }
    });
  }

  showEdit(testRun: TestRun, projectId: number, componentId: any = ''): void {
    const modal = this.modalService.create({
      nzContent: RunOperationComponent,
      nzData: { projectId },
      nzFooter: null,
      nzClosable: true,
      nzWidth: 500,
      nzMaskClosable: false,
      nzBodyStyle: { padding: '0 ' },
      nzComponentParams: {
        mode: 'edit',
      },
    });

    modal.afterClose.subscribe((result: TestRun | null) => {
      if (result) {
        this.dataUpdated.next(result);
      }
    });
  }
}
