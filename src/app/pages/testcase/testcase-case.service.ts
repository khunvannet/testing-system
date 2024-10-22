import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/helper/base-api.service';

export interface TestCase {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  notes?: string;
  attachment?: string;
  mainId?: number;
  mainName?: string;
  ordering?: number;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TestCaseService extends BaseApiService<TestCase> {
  constructor(protected override http: HttpClient) {
    super(http, 'test');
  }
}
