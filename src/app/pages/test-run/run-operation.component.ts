import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import {
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeNode,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-run-operation',
  template: `
    <div *nzModalTitle class="modal-header-ellipsis">
      <span class="title">{{ mode === 'add' ? 'Add ' : 'Edit ' }}</span>
    </div>
    <div class="modal-content" style="margin-top:10px;">
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzFor="code">Code</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="code" type="text" id="code" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzFor="title" nzRequired
            >Title</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <input nz-input formControlName="title" type="text" id="title" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzFor="project" nzRequired
            >Project</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <nz-select formControlName="project">
              <nz-option nzValue="Pos" nzLabel="Pos"></nz-option>
              <nz-option nzValue="PosAdmin" nzLabel="PosAdmin"></nz-option>
              <nz-option nzValue="Fitness" nzLabel="Fitness"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzFor="testcase">Test Case</nz-form-label>
          <nz-form-control [nzSpan]="16">
            <nz-tree
              #nzTreeComponent
              [nzData]="nodes"
              nzCheckable
              (nzClick)="nzClick($event)"
              (nzContextMenu)="nzClick($event)"
              (nzCheckBoxChange)="nzCheck($event)"
              (nzExpandChange)="nzCheck($event)"
            ></nz-tree>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzFor="description"
            >Description</nz-form-label
          >
          <nz-form-control [nzSpan]="16">
            <textarea
              rows="5"
              nz-input
              formControlName="description"
              id="description"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div>
        <button nz-button nzType="primary">
          {{ mode == 'add' ? 'Add' : 'Edit' }}
        </button>
        <button nz-button nzType="default">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      nz-tree {
        max-height: 140px;
        overflow-y: auto;
      }
      nz-select {
        width: 200px;
      }
      .title {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class RunOperationComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | undefined;
  @Input() form!: FormGroup;
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  nodes: NzTreeNodeOptions[] = [
    {
      title: 'Login',
      key: '100',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true },
      ],
    },
    {
      title: 'Logout',
      key: '102',
      expanded: true,
      children: [
        { title: 'leaf', key: '10012', isLeaf: true },
        { title: 'leaf', key: '10013', isLeaf: true },
        { title: 'leaf', key: '10014', isLeaf: true },
      ],
    },
  ];

  ngOnInit(): void {
    if (!this.form) {
      this.form = new FormGroup({
        code: new FormControl({ value: '', disabled: true }),
        title: new FormControl('', Validators.required),
        project: new FormControl('', Validators.required),
        testcase: new FormControl([]),
        description: new FormControl(''),
      });
    }
  }

  ngAfterViewInit(): void {
    this.form.get('code')?.disable();
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log('Click event', event);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log('Check event', event);
  }
}
