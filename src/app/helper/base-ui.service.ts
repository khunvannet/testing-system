import {
  EventEmitter,
  Inject,
  Injectable,
  TemplateRef,
  Type,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Injectable({ providedIn: 'root' })
export class BaseUiService<T = NzSafeAny> {
  constructor(
    protected modalService: NzModalService,
    @Inject('componentOperation')
    private componentOperation: string | TemplateRef<NzSafeAny> | Type<T>,
    @Inject('componentDelete')
    private componentDelete: string | TemplateRef<NzSafeAny> | Type<T>,
    @Inject('widthAdd') private widthAdd: string,
    @Inject('widthEdit') private widthEdit: string,
    @Inject('widthView') private widthView: string,
    @Inject('widthDelete') private widthDelete: string
  ) {}
  refresher: EventEmitter<{ key: string; value?: any; componentId?: any }> =
    new EventEmitter<{ key: string; value?: any; componentId?: any }>();

  showAdd(componentId: any = ''): void {
    this.modalService.create({
      nzContent: this.componentOperation,
      nzFooter: null,
      nzClosable: true,
      nzWidth: this.widthAdd,
      nzBodyStyle: { paddingBottom: '10px' },
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'added', value: e.model, componentId });
      },
    });
  }

  showEdit(id: number): void {
    this.modalService.create({
      nzContent: this.componentOperation,
      nzData: { id },
      nzFooter: null,
      nzClosable: true,
      nzWidth: this.widthEdit,
      nzBodyStyle: { paddingBottom: '10px' },
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'edited', value: e.model });
      },
    });
  }

  showView(id: number): any {
    this.modalService.create({
      nzContent: this.componentOperation,
      nzData: { id, isView: true },
      nzClosable: true,
      nzFooter: null,
      nzWidth: this.widthView,
      nzBodyStyle: { paddingBottom: '10px' },
      nzMaskClosable: false,
    });
  }

  showDelete(id: number): void {
    this.modalService.create({
      nzContent: this.componentDelete,
      nzData: { id },
      nzClosable: true,
      nzFooter: null,
      nzWidth: this.widthDelete,
      nzBodyStyle: { paddingBottom: '10px' },
      nzMaskClosable: false,
      nzOnOk: (e: any) => {
        this.refresher.emit({ key: 'deleted', value: e.model });
      },
    });
  }
}
