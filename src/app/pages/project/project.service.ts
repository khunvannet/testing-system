import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from 'src/app/helper/base-api.service';
import { SettingService } from 'src/app/app-setting';

export interface Project {
  id?: number;
  name?: string;
  description?: string;
  countRun?: number;
  countTest?: number;
  note?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService extends BaseApiService<Project> {
  constructor(
    protected override http: HttpClient,
    settingService: SettingService
  ) {
    super(http, 'Project', settingService);
  }
}
