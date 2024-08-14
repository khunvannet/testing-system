import { EventEmitter, Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OperationComponent } from './home-operation.component';
import { HomeService, Project } from './home.service';
@Injectable({
  providedIn: 'root',
})
export class HomeUiService {
  constructor(
    private modalService: NzModalService,
    private service: HomeService
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
    });
  }

  showEdit(project: Project) {
    this.modalService.create({
      nzContent: OperationComponent,
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 400,
      nzBodyStyle: { height: '300', padding: '0 ' },
      nzComponentParams: {
        mode: 'edit',
        project: project,
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
        this.service.deleteProject(id).subscribe({
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
