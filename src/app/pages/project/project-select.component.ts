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
import { HomeService, Project } from './project.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-select-project',
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
        *ngFor="let data of projects"
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
      useExisting: forwardRef(() => SelectProjectComponent),
      multi: true,
    },
  ],
  styles: [
    `
      nz-select {
        width: 235px;
      }
    `,
  ],
})
export class SelectProjectComponent implements OnInit, ControlValueAccessor {
  @Input() showAllOption: boolean = false;
  @Output() valueChanged = new EventEmitter<any>();
  selectedValue: number = 0;
  projects: Project[] = [];
  loading: boolean = false;
  searchText = '';
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };
  @Input() isDisabled: boolean = false;

  onChange = (_value: any) => {};
  onTouched = () => {};

  constructor(
    private service: HomeService,

    private router: Router
  ) {}

  ngOnInit(): void {
    const storedProjectId = localStorage.getItem('selectedProjectId');
    if (storedProjectId) {
      this.selectedValue = +storedProjectId;
      this.writeValue(this.selectedValue);
      this.valueChanged.emit(this.selectedValue);
    } else if (this.showAllOption) {
      this.selectedValue = 0;
    }
  }

  search() {
    this.loading = true;
    this.param.filters = JSON.stringify([
      { field: 'name', operator: 'contains', value: this.searchText },
    ]);
    if (this.searchText && this.param.pageIndex === 1) {
      this.projects = [];
    }
    this.service.search(this.param).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.projects = response.results;
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
    localStorage.setItem('selectedProjectId', this.selectedValue.toString());
    if (this.selectedValue === 0) {
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 0);
    }
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.selectedValue = value;
      this.onChange(this.selectedValue);
      this.search();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
