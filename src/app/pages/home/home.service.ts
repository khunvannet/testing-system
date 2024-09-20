import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from 'src/app/helper/base-api.service';

export interface Project {
  id?: number;
  name?: string;
  description?: string;
  note?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService extends BaseApiService<Project> {
  constructor(protected override http: HttpClient) {
    super(http, 'Project');
  }
}
