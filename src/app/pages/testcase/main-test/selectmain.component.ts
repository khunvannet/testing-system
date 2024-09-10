import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QueryParam } from 'src/app/helper/base-api.service';
import { MainTest, MainTestService } from './main-test.service';

@Component({
  selector: 'select-main',
  template: `
    <nz-select
      nzShowSearch
      [(ngModel)]="selectedValue"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
      [nzLoading]="loading"
      [disabled]="true"
    >
      <nz-option
        *ngFor="let data of main"
        [nzValue]="data.id"
        [nzLabel]="data.name! | translate"
      ></nz-option>
    </nz-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMainComponent),
      multi: true,
    },
  ],
})
export class SelectMainComponent implements OnInit, ControlValueAccessor {
  main: MainTest[] = [];
  selectedValue: any = null;
  loading: boolean = false;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    searchQuery: '',
  };
  constructor(private service: MainTestService) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.getAll(this.param).subscribe({
      next: (response: any) => {
        this.main = response.results;
        this.loading = false;
      },
      error: (error: any) => {
        console.error(error, 'fetching data faild');
      },
    });
  }
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
    this.onChangeCallback(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  private onChangeCallback = (value: any) => {};
  private onTouchedCallback = () => {};
}
