import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface QueryParam {
  pageIndex?: number;
  pageSize?: number;
  filters?: any;
}
export class BaseApiService<T> {
  constructor(protected http: HttpClient, private endpoint: string) {}

  protected apiUrl = environment.apiUrl;
  private getEndpoint(): string {
    return `${this.apiUrl}/${this.endpoint}`;
  }

  search(params: QueryParam): Observable<any> {
    const httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex!.toString())
      .set('pageSize', params.pageSize!.toString())
      .set('filters', `${params.filters === undefined ? '' : params.filters}`);

    return this.http.get<any>(this.getEndpoint(), { params: httpParams });
  }

  find(id: number): Observable<T> {
    return this.http.get<T>(`${this.getEndpoint()}/${id}`);
  }

  add(item: T): Observable<T> {
    return this.http.post<T>(this.getEndpoint(), item);
  }

  edit(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.getEndpoint()}/${id}`, item);
  }

  delete(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.getEndpoint()}/${id}`, data);
  }
  deleteTo(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.getEndpoint()}/${id}`, data);
  }
  public inused(id: number): Observable<any> {
    return this.http.get<any>(`${this.getEndpoint()}/${id}/can-remove`);
  }

  close(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.getEndpoint()}/${id}/close`, data);
  }
  clone(id: number, data: any): Observable<T> {
    return this.http.post<T>(`${this.getEndpoint()}/${id}/clone`, data);
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

    return this.http.get<{ exists: boolean }>(`${this.getEndpoint()}/exists`, {
      params: httpParams,
    });
  }

  updateOrdering(result: any = []): Observable<T> {
    return this.http.post<T>(`${this.getEndpoint()}/update-ordering`, result);
  }
}
