import { EventEmitter, Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OperationComponent } from './home-operation.component';
import { HomeService, Project } from './home.service';
import { DeleteProjectComponent } from './delete-project.component';
@Injectable({
  providedIn: 'root',
})
export class HomeUiService {
  constructor(
    private modalService: NzModalService,
  ) {}
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

  showEdit(id:number,name:string) {
    this.modalService.create({
      nzContent: OperationComponent,
      nzData:{id,name},
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
  showDelete(id:number,name:string) {
    this.modalService.create({
      nzContent: DeleteProjectComponent,
      nzData:{id,name},
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
