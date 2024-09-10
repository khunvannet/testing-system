import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeNodeOptions,
  NzTreeNode,
} from 'ng-zorro-antd/tree';
import {
  MainTest,
  MainTestService,
} from '../testcase/main-test/main-test.service';
import { TestCase, TestCaseService } from '../testcase/test-case.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { MainUiService } from '../testcase/main-test/main-ui.service';
import { TestCaseUiService } from '../testcase/test-case-ui.service';
import { Subscription } from 'rxjs';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-tree',
  template: `
    <ng-container *ngIf="nodes.length > 0; else treeadd">
      <nz-tree
        #nzTreeComponent
        [nzData]="nodes"
        nzCheckable
        nzMultiple
        (nzContextMenu)="nzContextMenu($event, menu)"
        (nzCheckBoxChange)="onCheckBoxChange($event)"
      ></nz-tree>

      <nz-dropdown-menu #menu="nzDropdownMenu">
        <ul nz-menu>
          <li nz-menu-item (click)="addNode()">Add</li>
          <li nz-menu-item (click)="editNode()">Edit</li>
          <li nz-menu-item (click)="deleteNode()">Delete</li>
        </ul>
      </nz-dropdown-menu>
    </ng-container>

    <ng-template #treeadd>
      <a (click)="uiService.showAdd()">Add New</a>
    </ng-template>
  `,
  styles: [
    `
      nz-tree {
        max-height: 130px;
        overflow-y: auto;
      }
    `,
  ],
})
export class TreeSelection implements OnChanges, OnDestroy {
  @Input() projectId!: number | null;
  @Input() formArray: FormArray | null = null;
  @Output() selectedTestCases = new EventEmitter<TestCase[]>();
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;

  nodes: NzTreeNodeOptions[] = [];
  main: MainTest[] = [];
  test: TestCase[] = [];
  currentNode: NzTreeNodeOptions | null = null;
  selectedTestCasesList: TestCase[] = [];
  private subscriptions = new Subscription();

  constructor(
    private mainTestService: MainTestService,
    private testCaseService: TestCaseService,
    private nzContextMenuService: NzContextMenuService,
    public uiService: MainUiService,
    public uiTestService: TestCaseUiService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && this.projectId !== null) {
      this.loadTreeData();
    }
  }

  loadTreeData(): void {
    this.getMainTests();
    this.getTestCases();
  }

  getMainTests(): void {
   
  }

  getTestCases(): void {
   
  }

  updateNodes(): void {
    
  }

  nzContextMenu(event: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create(event.event!, menu);
    this.currentNode = event.node?.origin ?? null;
  }

  onCheckBoxChange(event: NzFormatEmitEvent): void {
    const node = event.node as NzTreeNode;
    const checked = node?.isChecked ?? false;

    if (node) {
      const nodeKey = node.origin.key;

      if (nodeKey.startsWith('main-')) {
        // It's a main node, apply the checked state to all its children
        node.children.forEach((childNode) => {
          childNode.isChecked = checked;
          this.updateSelectedTestCases(childNode, checked);
        });
      } else if (nodeKey.startsWith('test-')) {
        // It's a test node, update its state
        this.updateSelectedTestCases(node, checked);
      }
    }

    // Emit the updated list of selected test cases
    this.selectedTestCases.emit(this.selectedTestCasesList);
  }

  updateSelectedTestCases(node: NzTreeNode, checked: boolean): void {
    const nodeKey = node.origin.key;

    if (nodeKey.startsWith('test-')) {
      const testId = parseInt(nodeKey.split('-')[1], 10);
      const testItem = this.test.find((item) => item.id === testId);

      if (testItem) {
        if (checked) {
          if (!this.selectedTestCasesList.some((tc) => tc.id === testId)) {
            this.selectedTestCasesList.push(testItem);
          }
        } else {
          this.selectedTestCasesList = this.selectedTestCasesList.filter(
            (tc) => tc.id !== testId
          );
        }
      }
    }
  }

  editNode(): void {
    if (this.currentNode) {
      const nodeKey = this.currentNode.key;
      if (nodeKey.startsWith('main-')) {
        const mainId = parseInt(nodeKey.split('-')[1], 10);
        const mainItem = this.main.find((item) => item.id === mainId);
       
      } else if (nodeKey.startsWith('test-')) {
        const testId = parseInt(nodeKey.split('-')[1], 10);
        const testItem = this.test.find((item) => item.id === testId);
       
      }
    }
  }

  addNode(): void {
    if (this.currentNode) {
      const nodeKey = this.currentNode.key;
      if (nodeKey.startsWith('main-')) {
        this.uiService.showAdd();
      } else if (nodeKey.startsWith('test-')) {
        const testId = parseInt(nodeKey.split('-')[1], 10);
        const testItem = this.test.find((item) => item.id === testId);
       
      }
    }
  }

  deleteNode(): void {
    if (this.currentNode) {
      const nodeKey = this.currentNode.key;
      if (nodeKey.startsWith('main-')) {
        const mainId = parseInt(nodeKey.split('-')[1], 10);
       
      } else if (nodeKey.startsWith('test-')) {
        const testId = parseInt(nodeKey.split('-')[1], 10);
        
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
