import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { QueryParam } from 'src/app/helper/base-api.service';
import { MainTest, MainTestService } from '../main/main-test.service';
import { TestCase, TestCaseService } from '../testcase/testcase-case.service';

@Component({
  selector: 'app-tree-select',
  template: `
    <nz-tree
      [nzData]="nodes"
      nzCheckable
      nzMultiple
      [nzCheckedKeys]="defaultCheckedKeys"
      [nzExpandedKeys]="defaultExpandedKeys"
      [nzSelectedKeys]="defaultSelectedKeys"
      (nzCheckBoxChange)="onTreeSelectionChange($event)"
    ></nz-tree>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
  ],
})
export class TreeSelectComponent implements OnInit, ControlValueAccessor {
  @Input() projectId = 0;
  @Output() treeSelectionChanged = new EventEmitter<any[]>();
  defaultCheckedKeys = [];
  defaultSelectedKeys: any[] = [];
  defaultExpandedKeys = [];
  main: MainTest[] = [];
  test: TestCase[] = [];
  loading: boolean = false;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 999999,
    filters: '',
  };
  nodes: any[] = [];

  private onChange = (value: any) => {};
  private onTouched = () => {};
  constructor(
    private mService: MainTestService,
    private tService: TestCaseService
  ) {}

  ngOnInit() {
    this.onMain();
  }

  onMain() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const filters = [
      { field: 'projectId', operator: 'eq', value: this.projectId },
    ];
    this.param.filters = JSON.stringify(filters);

    this.mService.search(this.param).subscribe({
      next: (response: any) => {
        this.main = response.results;
        this.buildTreeNodes();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async onTest(mainId: number) {
    const filters = [{ field: 'mainId', operator: 'eq', value: mainId }];
    this.param.filters = JSON.stringify(filters);

    try {
      const response = await this.tService.search(this.param).toPromise();
      return response.results;
    } catch {
      return [];
    }
  }

  async buildTreeNodes() {
    const nodes: any[] = [];

    for (const mainTest of this.main) {
      const testCases = await this.onTest(mainTest.id!);

      const childrenNodes = testCases.map((testCase: TestCase) => ({
        title: testCase.name,
        key: testCase.id,
        isLeaf: true,
      }));

      nodes.push({
        title: mainTest.name,
        key: mainTest.id,
        expanded: true,
        children: childrenNodes,
      });
    }

    this.nodes = nodes;
  }

  onTreeSelectionChange(event: NzFormatEmitEvent): void {
    if (event.node?.level === 0 && event.node.origin.checked) {
      this.nodes.forEach((item: any) => {
        if (item.key === event.node?.key) {
          item.children.forEach((i: any) => {
            if (!this.defaultSelectedKeys.includes(i.key)) {
              this.defaultSelectedKeys.push(i.key);
            }
          });
        }
      });
    } else if (event.node?.level === 0 && !event.node.origin.checked) {
      this.nodes.forEach((item: any) => {
        if (item.key === event.node?.key) {
          item.children.forEach((i: any) => {
            const index = this.defaultSelectedKeys.indexOf(i.key);
            if (index !== -1) {
              this.defaultSelectedKeys.splice(index, 1);
            }
          });
        }
      });
    } else {
      if (event.node?.isChecked) {
        // Add the key to defaultSelectedKeys if it's not already present
        if (!this.defaultSelectedKeys.includes(event.node.key)) {
          this.defaultSelectedKeys.push(event.node.key);
        }
      } else {
        // Remove the key from defaultSelectedKeys if it exists
        const index = this.defaultSelectedKeys.indexOf(event.node?.key);
        if (index !== -1) {
          this.defaultSelectedKeys.splice(index, 1);
        }
      }
    }
    this.treeSelectionChanged.emit(this.defaultSelectedKeys);
    this.onChange(this.defaultSelectedKeys);
  }
  writeValue(value: any): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.loading = isDisabled;
  }
}
