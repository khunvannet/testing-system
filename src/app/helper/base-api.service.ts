import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingService } from '../app-setting';
export interface QueryParam {
  pageIndex?: number;
  pageSize?: number;
  filters?: any;
}
export class BaseApiService<T> {
  constructor(
    protected http: HttpClient,
    private endpoint: string,
    private settingService: SettingService
  ) {}

  public apiUrl = (): string =>
    `${this.settingService.setting.BASE_API_URL}/${this.endpoint}`;

  search(params: QueryParam): Observable<any> {
    const httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex!.toString())
      .set('pageSize', params.pageSize!.toString())
      .set('filters', `${params.filters === undefined ? '' : params.filters}`);

    return this.http.get<any>(this.apiUrl(), { params: httpParams });
  }

  find(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl()}/${id}`);
  }

  add(item: T): Observable<T> {
    return this.http.post<T>(this.apiUrl(), item);
  }

  edit(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl()}/${id}`, item);
  }

  delete(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl()}/${id}`, data);
  }
  deleteTo(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl()}/${id}`, data);
  }
  public inused(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl()}/${id}/can-remove`);
  }

  close(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl()}/${id}/close`, data);
  }
  clone(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl()}/${id}/clone`, data);
  }
  exist(
    name: string = '',
    id: number = 0,
    params: { key: string; val: any }[] = []
  ): Observable<{ exists: boolean }> {
    if (!params) {
      params = [];
    }
    let httpParams = new HttpParams();
    params.forEach((pair) => {
      httpParams = httpParams.append(pair.key, pair.val);
    });
    if (name) {
      httpParams = httpParams.append('name', name);
    }
    httpParams = httpParams.append('id', id.toString());

    return this.http.get<{ exists: boolean }>(`${this.apiUrl()}/exists`, {
      params: httpParams,
    });
  }

  updateOrdering(result: any = []): Observable<T> {
    return this.http.post<T>(`${this.apiUrl()}/update-ordering`, result);
  }
}
