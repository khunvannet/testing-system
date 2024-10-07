import { Component, OnInit, Inject } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseApiService, QueryParam } from '../../helper/base-api.service';

@Component({
  selector: 'app-base-list',
  template: ``,
  styles: [],
})
export class BaseListComponent<T> implements OnInit {
  lists: T[] = [];
  loading: boolean = false;
  searchText: string = '';
  totalList = 0;
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    filters: '',
  };
  constructor(@Inject('BaseApiService') protected service: BaseApiService<T>) {}

  ngOnInit(): void {
    this.search();
  }
  search(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const filters: any[] = [
        { field: 'search', operator: 'contains', value: this.searchText },
      ];
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (response: any) => {
          this.lists = response.results;
          this.totalList = response.param.rowCount;
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
        },
      });
    }, 50);
  }
  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageIndex, pageSize } = params;
    this.param.pageIndex = pageIndex;
    this.param.pageSize = pageSize;
    this.search();
  }
}
