import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from 'src/app/app-setting';
import { BaseApiService } from 'src/app/helper/base-api.service';

export interface MainTest {
  id?: number;
  name?: string;
  ordering?: number;
  projectId?: number;
  projectName?: string;
  note?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MainTestService extends BaseApiService<MainTest> {
  constructor(
    protected override http: HttpClient,
    settingService: SettingService
  ) {
    super(http, 'mains', settingService);
  }
}
