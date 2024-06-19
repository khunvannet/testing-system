import { Injectable } from '@angular/core';
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
    private service: HomeService,
    private sanitizer: DomSanitizer
  ) {}

  showAdd(): NzModalRef {
    const modal = this.modalService.create({
      nzContent: OperationComponent,
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: 500,
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
      nzClosable: true,
      nzWidth: 500,
      nzComponentParams: {
        mode: 'edit',
        project: project,
      },
    });

    return modal;
  }

  showDelete(id: number, refreshCallback: () => void): void {
    const content: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
      '<b style="color: red;">Some description</b>'
    );

    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete?',

      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.service.deleteProject(id).subscribe({
          next: (response: any) => {
            console.log('Project deleted successfully:', response);
            refreshCallback(); // Call the refresh function to update the project list
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
