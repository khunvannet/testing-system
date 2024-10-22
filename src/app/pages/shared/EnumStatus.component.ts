import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Status } from '../test-run/active-run/run.service'; // Import the enum

@Component({
  selector: 'app-EnumStatus',
  template: `
    <nz-select
      nzShowSearch
      [nzServerSearch]="true"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
    >
      <nz-option
        *ngFor="let status of eNum"
        [nzValue]="status.id"
        [nzLabel]="status.name"
      >
        <span>{{ status.name }}</span>
      </nz-option>
    </nz-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EnumStatusComponent),
      multi: true,
    },
  ],
  styles: [
    `
      nz-select {
        width: 150px;
      }
    `,
  ],
})
export class EnumStatusComponent implements OnInit, ControlValueAccessor {
  @Input() showAllOption: boolean = false;
  @Output() valueChanged = new EventEmitter<any>();
  selectedValue: number = 0;
  loading: boolean = false;
  searchText = '';
  eNum: { id: Status; name: string }[] = [];
  onChange(_value: any) {}
  onTouched() {}

  constructor() {}

  ngOnInit() {
    // Map Status enum to a list of objects for the select options
    this.eNum = [
      { id: Status.AllStatus, name: 'All Status' },
      { id: Status.Success, name: 'Success' },
      { id: Status.Skip, name: 'Skip' },
      { id: Status.Pending, name: 'Pending' },
    ];
  }

  search() {
    // Handle search logic if needed
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
