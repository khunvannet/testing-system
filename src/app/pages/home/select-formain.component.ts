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
import { HomeService, Project } from '../home/home.service';
import { ProjectService } from 'src/app/helper/project-select.service';

@Component({
  selector: 'app-select-formain',
  template: `
    <nz-select
      nzShowSearch
      [(ngModel)]="selectedValue"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
      [nzLoading]="loading"
      [disabled]="isDisabled"
    >
      <nz-option
        *ngFor="let data of projects"
        [nzValue]="data.id"
        [nzLabel]="data.name! | translate"
      >
      </nz-option>
    </nz-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectForMainComponent),
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
export class SelectForMainComponent implements OnInit, ControlValueAccessor {
  projects: Project[] = [];
  selectedValue: any = null;
  loading: boolean = false;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    searchQuery: '',
  };

  @Input() isDisabled: boolean = false;

  @Output() pId: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private service: HomeService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getAll();
    const storedId = localStorage.getItem('selectedProjectId');
    if (storedId) {
      this.selectedValue = +storedId;
    }

    this.projectService.currentProjectId$.subscribe((id) => {
      if (id) {
        this.selectedValue = id;
      }
    });
  }

  getAll(): void {
    this.loading = true;
    this.service.getAll(this.param).subscribe({
      next: (data) => {
        this.projects = data.results;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  onChange = (value: any) => {
    if (this.isDisabled) return; // Prevent changes if disabled
    this.selectedValue = value;
    localStorage.setItem('selectedProjectId', value);
    this.onChangeCallback(value);
    this.pId.emit(value);
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
