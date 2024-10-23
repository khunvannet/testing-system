import { Injectable } from '@angular/core';
import { APP_STORAGE_KEY } from '../const';
import { Tenant, App } from './sessionStorage.service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private localStorage: any = localStorage;

  private get tenant(): Tenant {
    return JSON.parse(this.localStorage.getItem(APP_STORAGE_KEY.Tenant));
  }

  private get app(): App {
    return JSON.parse(this.localStorage.getItem(APP_STORAGE_KEY.App));
  }

  getValue<T>(key: string): T {
    return JSON.parse(
      <string>(
        this.localStorage.getItem(
          `${this.app?.appCode}-${this.tenant?.code}-${key}`
        )
      )
    );
  }

  setValue(option: { key: string; value: any }): void {
    if (
      this.localStorage.getItem(
        `${this.app?.appCode}-${this.tenant?.code}-${option.key}`
      )
    ) {
      this.localStorage.removeItem(
        `${this.app?.appCode}-${this.tenant?.code}-${option.key}`
      );
    }
    this.localStorage.setItem(
      `${this.app.appCode}-${this.tenant.code}-${option.key}`,
      JSON.stringify(option.value)
    );
  }

  removeValue(key: any): void {
    this.localStorage.removeItem(
      `${this.app.appCode}-${this.tenant.code}-${key}`
    );
  }
}
