import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Project, HomeService } from './home.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of, map, catchError } from 'rxjs';
@Component({
  selector: 'app-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span *ngIf="mode === 'add'">{{'Add' | translate}} </span>
      <span *ngIf="mode === 'edit'">{{'Edit' | translate}} {{modal?.name}}</span>
    </div>
    <div class="modal-content">
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="name" nzRequired>
          {{'Name'| translate}}
          </nz-form-label>
          <nz-form-control [nzSpan]="15" nzHasFeedback [nzErrorTip]="errorTpl">
            <input nz-input formControlName="name" id="name" />
            <ng-template #errorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">
              {{'Input is required!' | translate}}
              </ng-container>
              <ng-container *ngIf="control.hasError('nameExists')">
              {{'Name already exists!' | translate}}
              </ng-container>
            </ng-template>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="8" nzFor="description">
           {{'Description' | translate}}
          </nz-form-label>
          <nz-form-control [nzSpan]="15">
            <textarea
              rows="3"
              nz-input
              formControlName="description"
              id="description"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button *ngIf="mode === 'add'"
        [disabled]="!frm.valid || nameExists"
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
      {{'Add' | translate}}
      </button>
      <button *ngIf="mode ==='edit'"
        [disabled]="!frm.valid || nameExists"
        nz-button
        nzType="primary"
        [nzLoading]="loading"
        (click)="onSubmit()"
      >
        {{'Edit' | translate}}
      </button>
      <button nz-button nzType="default" (click)="onCancel()">{{'Cancel' | translate}}</button>
    </div>
  `,
  styles: [
    `
      ::ng-deep .ant-modal-header {
        padding: 8px 10px;
      }
      .modal-content {
        padding-top: 20px;
      }
      .modal-header-ellipsis {
        display: block;
        text-align: center;
      }
      .error-message {
        color: red;
      }
    `,
  ],
})
export class OperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() refreshList = new EventEmitter<Project>();
  frm!: FormGroup;
  loading = false;
  nameExists = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private service: HomeService,
    private notification:NzNotificationService
    
  ) {}
  readonly modal = inject(NZ_MODAL_DATA) ;
  ngOnInit(): void {
   this.initControl();
   if (this.mode === 'edit' && this.modal.id) {
    this.setFrmValue();
  }
  }
  private initControl(): void {
    this.frm = this.fb.group({
      name: [null, [Validators.required], [this.nameExistsValidator.bind(this)] ],
      description: [null],
    });
  }
  private setFrmValue():void {
    this.service.find(this.modal.id).subscribe({
      next:(results)=>{
        this.frm.setValue({
          name: results.name,
          description: results.description || null,
        })
      }
    })
  }
  nameExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const name = control.value;
    
    if (!name) {
      return of(null);
    }
  
    const projectId = this.mode === 'edit' ? this.modal.id : null;
  
    return this.service.nameIsExist(name, projectId).pipe(
      map((response) => (response.exists ? { nameExists: true } : null)),
      catchError(() => of(null))
    );
  }
  
  onSubmit(): void {
   if(this.frm.valid){
    this.loading=true;
    const data ={...this.frm.value};
    if(this.mode === 'add'){
      this.service.add(data).subscribe({
        next:()=>{
          this.loading = false;
          this.modalRef.triggerOk();
        },error:(err:any)=>{
         this.notification.error('Data','Add faild');
        }
       })
    } else if (this.mode === 'edit' && this.modal.id) {
      this.service.edit(this.modal.id,data).subscribe({
        next:()=>{
          this.loading = false;
          this.modalRef.triggerOk();
        },error:()=>{
          this.notification.error('Data','edit faild');
        }
      })
    }
   }
    
  }
  onCancel(): void {
    this.modalRef.close();
  }
 
}


