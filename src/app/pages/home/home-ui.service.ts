import { EventEmitter, Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OperationComponent } from './home-operation.component';
import { HomeService, Project } from './home.service';
import { NotificationService } from 'src/app/helper/notification.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeUiService {
  dataChanged = new EventEmitter<void>();
  projectAdded$ = new Subject<void>();
  constructor(
    private modalService: NzModalService,
    private service: HomeService,
    private notificationService: NotificationService
  ) {}

  showAdd(): NzModalRef {
    const modal = this.modalService.create({
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

    return modal;
  }

  showEdit(project: Project): NzModalRef {
    const modal = this.modalService.create({
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

    return modal;
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
            // Show success notification
            this.notificationService.successNotification(
              'Project deleted successfully!'
            );
            refreshCallback();
          },
          error: (error: any) => {
            console.error('Error deleting project:', error);
            // Show error notification
            this.notificationService.customErrorNotification(
              'Failed to delete project.'
            );
          },
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
}
