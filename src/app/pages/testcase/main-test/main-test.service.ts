import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helper/base-api.service';

export interface MainTest {
  id?: number;
  name?: string;
  projectId?: number;
  notes?:string;
  active?:boolean;

}

@Injectable({
  providedIn: 'root',
})
export class MainTestService extends BaseApiService<MainTest>{
  constructor(protected override http: HttpClient) {
    super(http,'main');
  }
}
