import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QueryParam } from 'src/app/helper/base-api.service';
import { MainTest, MainTestService } from './main-test.service';

@Component({
  selector: 'select-main',
  template: `
    <nz-select
      nzShowSearch
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      (nzOnSearch)="onSearch($event)"
      [nzDisabled]="isDisabled"
    >
      <nz-option
        *ngIf="showAllOption"
        [nzValue]="0"
        [nzLabel]="'All Projects' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let data of main"
        nzCustomContent
        [nzValue]="data.id"
        [nzLabel]="data.name!"
      >
        <span>{{ data.name }}</span>
      </nz-option>
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
  @Input() showAllOption: boolean = false;
  @Output() valueChanged = new EventEmitter<any>();
  selectedValue: number = 0;
  main: MainTest[] = [];
  loading: boolean = false;
  searchText = '';
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };
  @Input() isDisabled: boolean = false;
  onChange(_value: any) {}
  onTouched() {}

  constructor(private service: MainTestService) {}
  ngOnInit(): void {
    if (this.showAllOption) this.selectedValue = 0;
  }

  search() {
    this.loading = true;
    this.param.filters = JSON.stringify([
      { field: 'name', operator: 'contains', value: this.searchText },
    ]);
    if (this.searchText && this.param.pageIndex === 1) {
      this.main = [];
    }
    this.service.search(this.param).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.main = response.results;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSearch(value: string): void {
    this.searchText = value;
    this.param.pageIndex = 1;
    this.search();
  }

  onModalChange() {
    this.valueChanged.emit(this.selectedValue);
    this.onChange(this.selectedValue);
  }
  writeValue(value: any): void {
    this.selectedValue = value;
    this.search();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
