import { Injectable } from '@angular/core';
import { APP_STORAGE_KEY } from '../const';

export interface App {
  appName?: string;
  appCode?: string;
  language?: string;
  iconUrl?: string;
}

export interface Tenant {
  name?: string;
  note?: string;
  code?: string;
  logo?: string;
  tenantData?: string;
}
@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  private sessionStorage: any = sessionStorage;

  private get tenant(): Tenant {
    return JSON.parse(localStorage.getItem(APP_STORAGE_KEY.Tenant) as string);
  }

  private get app(): App {
    return JSON.parse(localStorage.getItem(APP_STORAGE_KEY.App) as string);
  }

  getValue<T>(key: string): T {
    return JSON.parse(
      <string>(
        this.sessionStorage.getItem(
          `${this.tenant?.code}-${this.app?.appCode}-${key}`
        )
      )
    );
  }

  setValue(option: { key: string; value: any }): void {
    if (
      this.sessionStorage.getItem(
        `${this.tenant?.code}-${this.app?.appCode}-${option.key}`
      )
    ) {
      this.sessionStorage.removeItem(
        `${this.tenant?.code}-${this.app?.appCode}-${option.key}`
      );
    }
    this.sessionStorage.setItem(
      `${this.tenant?.code}-${this.app?.appCode}-${option.key}`,
      JSON.stringify(option.value)
    );
  }

  removeValue(key: any): void {
    this.sessionStorage.removeItem(
      `${this.tenant?.code}-${this.app?.appCode}-${key}`
    );
  }
  setPageSizeOptionKey(pageSize: any, key: any) {
    let value: any[] = [];
    value = this.getValue('page-size-option') || [];
    const index = value.findIndex((e: { key: any }) => e.key === key);
    index !== -1
      ? (value[index].value = pageSize)
      : value.push({ key: key, value: pageSize });
    this.setValue({ key: 'page-size-option', value });
  }
  getCurrentPageSizeOption(key: any): any {
    let pageSizeOptions: any[] = [];
    pageSizeOptions = this.getValue('page-size-option') ?? [];
    return pageSizeOptions.filter((item) => item.key === key)[0]?.value;
  }
}
