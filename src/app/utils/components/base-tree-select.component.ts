import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BaseApiService, QueryParam } from 'src/app/helper/base-api.service';
@Component({
  template: ``,
})
export class BaseTreeSelectComponent<T>
  implements OnInit, ControlValueAccessor
{
  constructor(
    public service: BaseApiService<any>,
    public translate: TranslateService,
    private renderer: Renderer2,
    @Inject('') public parentStorageKey: string
  ) {}
  @ViewChild('treeSelect', { static: false, read: ElementRef })
  treeSelectElementRef!: ElementRef;

  selectedValue?: any;
  lists: T[] = [];
  nodes: any[] = [];
  loading = false;
  firstTime = true;
  isSearch = false;
  expandedKeys: any = [];
  allOptionLabel: string = '';
  param: QueryParam = {
    pageSize: 100000,
    pageIndex: 1,
    filters: '',
  };

  @Input() isForReport = true;
  @Input() storageKey!: string;
  @Input() disabled = false;
  @Input() addOption: boolean = false;
  @Input() showAllOption: boolean = false;
  @Output() valueChanged = new EventEmitter<any>();

  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  ngOnInit(): void {
    this.search();

    if (this.showAllOption && !this.selectedValue) {
      this.selectedValue = 0;
    }
    this.valueChanged.emit(this.selectedValue);
    this.onChangeCallback(this.selectedValue);
    this.onTouchedCallback(this.selectedValue);
    if (this.isForReport) this.onModalChange();
  }

  search(e = '') {
    const filters: any[] = [
      { field: 'search', operator: 'contains', value: e },
    ];
    this.param.filters = JSON.stringify(filters);
    this.service.search(this.param).subscribe((data: any) => {
      this.nodes = [];

      this.lists = data.results;

      this.nodes = this.buildTree(this.lists);
      this.expandedKeys = this.findParentKeys(this.nodes, this.selectedValue);
    });
  }

  buildTree(data: any[], leaf?: any[]): any[] {
    const tree: any[] = [];
    const childrenOf: any = {};
    const nodesById: any = {};

    data.forEach((item) => {
      childrenOf[item.id] = [];
      nodesById[item.id] = {
        ...item,
        title:
          this.translate.currentLang === 'km'
            ? item.pathName || item.pathNameEn
            : item.pathNameEn || item.pathName,
        key: item.id,
        name:
          this.translate.currentLang === 'km'
            ? item.name || item.nameEn
            : item.nameEn || item.name,
        children: childrenOf[item.id],
        isLeaf: true,
        expanded: this.isSearch,
      };
    });

    data.forEach((item) => {
      const newItem = nodesById[item.id];
      const parentId = item.parentId;

      if (parentId === 0) {
        newItem.expanded = true;
        tree.push(newItem);
      } else {
        childrenOf[parentId] = childrenOf[parentId] || [];
        childrenOf[parentId].push(newItem);
        nodesById[parentId].isLeaf = false;
      }
    });

    if (this.showAllOption && this.firstTime) {
      tree.unshift({
        title: this.translate.instant(this.allOptionLabel),
        name: this.translate.instant(this.allOptionLabel),
        key: 0,
        value: 0,
        isLeaf: true,
        expanded: false,
      });
      this.firstTime = false;
    }

    // Update isLeaf property for all nodes
    for (const id in nodesById) {
      if (childrenOf[id].length > 0) {
        nodesById[id].isLeaf = false;
      }
    }

    return tree;
  }
  findParentKeys(
    nodes: any[],
    targetKeys: string | string[],
    paths: string[] = [], // Change to string[] instead of string[][]
    currentPath: string[] = []
  ): string[] {
    // Convert targetKeys to an array if it's a single string
    const keysToFind = Array.isArray(targetKeys) ? targetKeys : [targetKeys];

    for (const node of nodes) {
      if (keysToFind.includes(node.key)) {
        paths.push(...currentPath, node.key); // Push individual path elements
      }
      if (node.children) {
        this.findParentKeys(node.children, keysToFind, paths, [
          ...currentPath,
          node.key,
        ]);
      }
    }
    return paths;
  }

  applyDefaultValue(values: any[]) {
    console.log(values);

    values.length > 1
      ? (this.selectedValue = values)
      : (this.selectedValue = parseInt(values.join()));
    this.onModalChange();
  }

  onModalChange(e?: any) {
    if (this.selectedValue) {
      this.valueChanged.emit(this.selectedValue);
      this.onChangeCallback(this.selectedValue);
      this.onTouchedCallback(this.selectedValue);
    }
  }
  writeValue(value: any) {
    console.log('VALUE', value);

    this.selectedValue = value;
  }
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  hideSelectItem(e: boolean) {
    const items = this.treeSelectElementRef.nativeElement.querySelectorAll(
      '.ant-select-selection-item'
    );
    items.forEach((item: HTMLElement) => {
      this.renderer.setStyle(item, 'width', e ? '70px' : '');
    });
  }
  openChange(e: any) {
    if (this.isForReport) this.hideSelectItem(e);
  }
}
