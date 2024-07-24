import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MainTest, MainTestService } from './main-test.service';

@Component({
  selector: 'select-main',
  template: `
    <nz-select
      nzShowSearch
      [(ngModel)]="selectedValue"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
      [nzDisabled]="true"
    >
      <nz-option
        *ngFor="let data of main"
        [nzValue]="data.id"
        [nzLabel]="data.name"
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
  selectedValue: any = null;
  main: MainTest[] = [];

  constructor(private service: MainTestService) {}

  ngOnInit(): void {
    this.service.getMain().subscribe({
      next: (result) => (this.main = result),
      error: (err) => console.error('Error fetching MainTest data:', err),
    });
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
