import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helper/base-api.service';
export interface Rundetail {
  id?: number;
  code?: string;
  runId?: number;
  testId?: number;
  testName?: string;
  statusId?: number;
  statusName?: string;
  active?: boolean;
  note?: string;
}
export enum Status {
  AllStatus = 0,
  Success = 1,
  Skip = 2,
  Pending = 3,
}
@Injectable({
  providedIn: 'root',
})
export class RunService extends BaseApiService<Rundetail> {
  constructor(protected override http: HttpClient) {
    super(http, 'RunDetail');
  }
}
