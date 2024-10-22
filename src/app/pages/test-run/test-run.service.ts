import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/helper/base-api.service';

export interface TestRun {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  projectId?: number;
  projectName?: string;
  testId?: number;
  testName?: string;
  statusId?: number;
  statusName?: string;
  ordering?: number;
  active?: boolean;
  note?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TestRunService extends BaseApiService<TestRun> {
  constructor(protected override http: HttpClient) {
    super(http, 'TestRun');
  }
}
