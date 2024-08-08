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
  private subscriptions: Subscription = new Subscription();

  constructor(
    private service: MainTestService,
    private testService: TestCaseService,
    private nzContextMenuService: NzContextMenuService,
    public uiService: MainUiService,
    public uiTest: TestCaseUiService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId']) {
      if (this.projectId !== null) {
        this.getMain();
        this.getTest();
      }
    }
  }

  getMain() {
    if (this.projectId !== null) {
      const mainSubscription = this.service.getMain().subscribe({
        next: (data) => {
          this.main = data.filter(
            (mainItem) => mainItem.projectId === this.projectId
          );
          this.updateNodes();
        },
      });
      this.subscriptions.add(mainSubscription);
    }
  }

  getTest() {
    const testSubscription = this.testService.getTree().subscribe({
      next: (data) => {
        this.test = data;
        this.updateNodes();
      },
    });
    this.subscriptions.add(testSubscription);
  }

  updateNodes() {
    this.nodes = this.main.map((mainItem) => {
      return {
        title: mainItem.name,
        key: `main-${mainItem.id}`,
        expanded: true,
        children: this.test
          .filter((testItem) => testItem.mainId === mainItem.id)
          .map((testItem) => {
            return {
              title: testItem.name,
              key: `test-${testItem.id}`,
              isLeaf: true,
            };
          }),
      };
    });
  }

  nzContextMenu(event: NzFormatEmitEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create(event.event!, menu);
    this.currentNode = event.node ? event.node.origin : null;
  }

  onCheckBoxChange(event: NzFormatEmitEvent): void {
    const node = event.node as NzTreeNode;
    const checked = node?.isChecked;

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
        if (mainItem) {
          this.uiService.showEdit(mainItem);
        }
      } else if (nodeKey.startsWith('test-')) {
        const testId = parseInt(nodeKey.split('-')[1], 10);
        const testItem = this.test.find((item) => item.id === testId);
        if (testItem) {
          const mainItem = this.main.find(
            (main) => main.id === testItem.mainId
          );
          if (mainItem) {
            this.uiTest.showEdit(testItem, mainItem.id, '');
          }
        }
      }
    }
  }

  addNode(): void {
    if (this.currentNode) {
      const nodeKey = this.currentNode.key;
      if (nodeKey.startsWith('main-')) {
        const mainId = parseInt(nodeKey.split('-')[1], 10);
        const mainItem = this.main.find((item) => item.id === mainId);
        if (mainItem) {
          this.uiService.showAdd();
        }
      } else if (nodeKey.startsWith('test-')) {
        const testId = parseInt(nodeKey.split('-')[1], 10);
        const testItem = this.test.find((item) => item.id === testId);
        if (testItem) {
          const mainItem = this.main.find(
            (main) => main.id === testItem.mainId
          );
          if (mainItem) {
            this.uiTest.showAdd(mainItem.id);
          }
        }
      }
    }
  }

  deleteNode(): void {
    if (this.currentNode) {
      const nodeKey = this.currentNode.key;
      if (nodeKey.startsWith('main-')) {
        const mainId = parseInt(nodeKey.split('-')[1], 10);
        const mainItem = this.main.find((item) => item.id === mainId);
        if (mainItem) {
          this.uiService.showDelete(mainId, () => this.getMain());
        }
      } else if (nodeKey.startsWith('test-')) {
        const testId = parseInt(nodeKey.split('-')[1], 10);
        const testItem = this.test.find((item) => item.id === testId);
        if (testItem) {
          this.uiTest.showDelete(testId, () => this.getTest());
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
