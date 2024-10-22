import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QueryParam } from 'src/app/helper/base-api.service';
import { BaseListComponent } from 'src/app/utils/components/base-list.component';
import { TestCase, TestCaseService } from './testcase-case.service';

@Component({
  selector: 'app-test-multiple-select',
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
        [nzLabel]="'AllTest' | translate"
      ></nz-option>
      <nz-option
        *ngFor="let item of lists"
        nzCustomContent
        [nzValue]="item.id"
        [nzLabel]="(item.code ?? '') + ' - ' + (item.name ?? '')"
      >
        {{ item.code }} - {{ item.name }}
      </nz-option>
    </nz-select>
    <ng-template #tagPlaceHolder let-selectedList
      >and {{ selectedList.length }} more selected</ng-template
    >
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestMultipleSelectComponent),
      multi: true,
    },
  ],
})
export class TestMultipleSelectComponent
  extends BaseListComponent<TestCase>
  implements OnInit, ControlValueAccessor, OnChanges
{
  @Output() valueChanged = new EventEmitter<any>();
  selectedValue: any[] = [];

  @Input() selectedMainIds: number[] = [];

  override param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };

  onChange(_value: any) {}
  onTouched() {}

  constructor(service: TestCaseService) {
    super(service);
  }

  override ngOnInit() {
    this.search();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMainIds']) {
      this.search();
    }
  }

  override search() {
    this.loading = true;
    const filters: any[] = [
      { field: 'name', operator: 'contains', value: this.searchText },
      // { field: 'mainId', operator: 'in', value: this.selectedMainIds },
    ];

    this.param.filters = JSON.stringify(filters);

    if (this.searchText && this.param.pageIndex === 1) {
      this.lists = [];
    }
    this.service.search(this.param).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.lists = response.results.filter(
          (item: TestCase) =>
            item.mainId !== undefined &&
            this.selectedMainIds.includes(item.mainId)
        );
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
    if (this.selectedValue.includes('all')) {
      this.selectedValue = this.lists.map((item) => item.id);
    }
    this.onChange(this.selectedValue);
    this.valueChanged.emit(this.selectedValue);
  }
  writeValue(value: any): void {
    if (Array.isArray(value)) {
      this.selectedValue = value;
    } else {
      this.selectedValue = value ? [value] : [];
    }
    this.search();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
