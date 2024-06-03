import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  template: `
    <nz-breadcrumb
      style="height: 42px;line-height: 42px; border-bottom:1px solid rgba(188,188,188,0.56)"
    >
      <nz-breadcrumb-item>
        <a [routerLink]="result[0].url">
          <i nz-icon nzType="arrow-left" nzTheme="outline"></i>
          <span>{{ result[0].label }}</span>
        </a>
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>{{ result[1].label }}</nz-breadcrumb-item>
    </nz-breadcrumb>
  `,
  styles: [
    `
      ::ng-deep .ant-breadcrumb-link .anticon + span {
        margin-left: 0.9em;
      }
    `,
  ],
})
export class BreadcrumbComponent implements OnInit {
  @Input() data!: Observable<Data>;
  result: Data = [];
  ngOnInit(): void {
    this.data.subscribe((result) => {
      this.result = result;
    });
  }
}
