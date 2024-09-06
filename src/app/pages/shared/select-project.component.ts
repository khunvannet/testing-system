import { Component, EventEmitter, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QueryParam } from 'src/app/helper/base-api.service';
import { HomeService, Project } from '../home/home.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-select-pro',
  template: `
    <nz-select
      nzShowSearch
      [(ngModel)]="selectedValue"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
      [nzLoading]="loading"
    >
      <nz-option
        *ngFor="let data of projects"
        [nzValue]="data.id"
        [nzLabel]="(data.name! | translate)"
      >
      </nz-option>
    </nz-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectProComponent),
      multi: true,
    },
  ],
  styles: [
    `
       nz-select {
        width: 240px;
      }
    `,
  ],
})
export class SelectProComponent implements OnInit, ControlValueAccessor {
  @Input() pId: number | null = null;
  projects: Project[] = [];
  selectedValue: any = null;
  loading: boolean = false;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    searchQuery: '',
  };

  constructor(
    private service: HomeService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading = true;
    this.service.getAll(this.param).subscribe({
      next: (data) => {
        this.projects = [{ id: null, name: 'All Projects' }, ...data.results];
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.notification.error('Error', 'Failed to load projects.');
        this.loading = false;
      },
    });
  }

  onChange = (value: any) => {
    this.selectedValue = value;
    this.onChangeCallback(value);
  };

  onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private onChangeCallback = (value: any) => {};
  private onTouchedCallback = () => {};
}
