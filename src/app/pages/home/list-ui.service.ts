import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OperationComponent } from './home-operation.component';
import { Project } from './home.service';

import { HomeService } from './home.service';
import { ProjectService } from 'src/app/helper/projecttservice.service';

@Injectable({
  providedIn: 'root',
})
export class ListUiService {
  constructor(
    private modalService: NzModalService,
    private projectService: ProjectService,
    private homeService: HomeService
  ) {}

  showAdd(componentId: any = ''): void {
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

    modal.afterOpen.subscribe(() => {
      (modal.getContentComponent() as OperationComponent).modalInstance = modal;
    });
  }

  showDelete(project: Project): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete?',
      nzContent: '<b style="color: red;">Some description</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.projectService.deleteProject(project);
        this.homeService.fetchAndSetProjects();
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  showEdit(project: Project): void {
    this.modalService.create({
      nzTitle: 'Edit Project',
      nzContent: OperationComponent,
      nzFooter: null,
      nzWidth: 500,
      nzComponentParams: {
        mode: 'edit',
        project: project,
      },
      nzMaskClosable: false,
    });
  }
}
