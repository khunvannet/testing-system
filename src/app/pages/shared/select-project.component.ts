import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HomeService, Project } from '../home/home.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QueryParam } from 'src/app/helper/base-api.service';
import { ProjectService } from 'src/app/helper/project-select.service';
import { Router } from '@angular/router';

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
        nzLabel="{{ this.allPro | translate }}"
        nzValue="All Projects"
      ></nz-option>
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
  allPro = 'All Projects';
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
    private notification: NzNotificationService,
    private projectService: ProjectService,
    private router: Router
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
        this.notification.error('Error', 'Failed to load projects.');
        this.loading = false;
      },
    });
  }

  onChange = (value: any) => {
    this.selectedValue = value;
    localStorage.setItem('selectedProjectId', value);
    this.onChangeCallback(value);
    this.projectService.changeProjectId(value);

    if (value === 'All Projects') {
      this.router.navigate(['home']); // Navigate to home page
    }
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
