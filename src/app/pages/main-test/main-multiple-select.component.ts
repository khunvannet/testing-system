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
import { BaseListComponent } from 'src/app/utils/components/base-list.component';
import { MainTest, MainTestService } from './main-test.service';

@Component({
  selector: 'app-main-multiple-select',
  template: `
    <nz-select
      [nzMaxTagCount]="3"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      nzMode="multiple"
      nzPlaceHolder="Please select"
      [(ngModel)]="selectedValue"
      (ngModelChange)="onModalChange()"
      style="width: 100%"
    >
      <nz-option
        [nzValue]="'all'"
        [nzLabel]="'All Mains' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="item.name ?? ''"
      >
        {{ item.name }}
      </nz-option>
    </nz-select>
    <ng-template #tagPlaceHolder let-selectedList>
      and {{ selectedList.length }} more selected
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MainMultipleSelectComponent),
      multi: true,
    },
  ],
})
export class MainMultipleSelectComponent
  extends BaseListComponent<MainTest>
  implements OnInit, ControlValueAccessor
{
  @Input() projectId = 0;
  @Output() valueChanged = new EventEmitter<any>();
  selectedValue: any[] = [];
  override param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };
  onChange(_value: any) {}
  onTouched() {}

  constructor(service: MainTestService) {
    super(service);
  }

  override ngOnInit() {
    this.search();
  }

  override search() {
    this.loading = true;
    this.param.filters = JSON.stringify([
      { field: 'projectId', operator: 'eq', value: this.projectId },
    ]);
    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service.search(this.param).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.lists = response.results;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onModalChange() {
    // Check if 'All Mains' is selected
    if (this.selectedValue.includes('all')) {
      // Select all the options except 'All Mains'
      this.selectedValue = this.lists.map((item) => item.id);
    }
    // Call registered change handler and emit valueChanged event
    this.onChange(this.selectedValue);
    this.valueChanged.emit(this.selectedValue);
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
