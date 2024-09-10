import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface QueryParam {
  pageIndex: number;
  pageSize: number;
  searchQuery: string;
}
export class BaseApiService<T> {
  constructor(protected http: HttpClient, private endpoint: string) {}

  protected apiUrl = environment.apiUrl;
  private getEndpoint(): string {
    return `${this.apiUrl}/${this.endpoint}`;
  }

  getAll(params: QueryParam): Observable<any> {
    const httpParams = new HttpParams()
      .set('pageIndex', params.pageIndex.toString())
      .set('pageSize', params.pageSize.toString())
      .set('searchQuery', params.searchQuery);

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
    return this.http.patch<T>(`${this.getEndpoint()}/${id}`, data);
  }
  nameIsExist(name: string, id?: number): Observable<{ exists: boolean }> {
    const params: any = { name };
    if (id) {
      params.id = id;
    }
    return this.http.get<{ exists: boolean }>(`${this.getEndpoint()}/isExist`, {
      params,
    });
  }
  mainIsExist(
    name?: string,
    id?: number,
    projectId?: number
  ): Observable<{ exists: boolean }> {
    const params: any = { name, projectId };
    if (id) {
      params.id = id;
    }
    if (projectId) {
      params.projectId = projectId;
    }

    return this.http.get<{ exists: boolean }>(`${this.getEndpoint()}/isExist`, {
      params,
    });
  }
  isExist(
    name?: string,
    id?: number,
    mainId?: number
  ): Observable<{ exists: boolean }> {
    const params: any = { name, mainId };
    if (id) {
      params.id = id;
    }
    if (mainId) {
      params.mainId = mainId;
    }

    return this.http.get<{ exists: boolean }>(`${this.getEndpoint()}/isExist`, {
      params,
    });
  }
}
