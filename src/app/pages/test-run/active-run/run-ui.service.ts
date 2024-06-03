import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { RunResultsComponent } from './result-modal.component';

@Injectable({
  providedIn: 'root',
})
export class RunUiService {
  constructor(private modalService: NzModalService) {}

  showUpdateResult(componentId: any = ''): void {
    this.modalService.create({
      nzContent: RunResultsComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzWidth: 750,
    });
  }
}
