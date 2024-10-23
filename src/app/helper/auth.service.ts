import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { APP_STORAGE_KEY } from '../const';
import { SettingService } from '../app-setting';
import { LanguageService } from './language.service';

export interface ClientInfo {
  id?: number;
  name?: string;
  fullName?: string;
  email?: string;
  token?: string;
  branchId?: string;
  changePasswordRequired?: boolean;
  permissions?: number[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private settingService: SettingService,
    private languageService: LanguageService,
    private titleService: Title
  ) {}
  clientInfo: ClientInfo = this.getStorageValue(APP_STORAGE_KEY.Authorized);

  get url() {
    return this.settingService.setting.AUTH_API_URL;
  }

  get tenant(): any | undefined {
    return this.getStorageValue(APP_STORAGE_KEY.Tenant);
  }

  get app(): any | undefined {
    return this.getStorageValue(APP_STORAGE_KEY.App);
  }

  redirectLogin(model: any) {
    return this.httpClient
      .post(`${this.url}/auth/redirect-login`, model, {
        withCredentials: true,
        headers: { disableErrorNotification: 'yes' },
      })
      .pipe(
        map((result) => {
          this.setStorageValue({
            key: APP_STORAGE_KEY.Authorized,
            value: result,
          });
          this.clientInfo = result;
          return result;
        })
      );
  }

  redirectRequest(appId: string) {
    return this.httpClient
      .post(`${this.url}/auth/redirect-request`, {
        app: appId,
        withCredentials: true,
        headers: { disableErrorNotification: 'yes' },
      })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  login(model: any) {
    return this.httpClient
      .post(`${this.url}/auth/login`, model, {
        withCredentials: true,
        headers: { disableErrorNotification: 'yes' },
      })
      .pipe(
        map((result) => {
          this.setStorageValue({
            key: APP_STORAGE_KEY.Authorized,
            value: result,
          });
          this.clientInfo = result;
          return result;
        })
      );
  }
  logout() {
    return this.httpClient
      .get(`${this.url}/auth/logout`, { withCredentials: true })
      .pipe(
        map((result) => {
          this.removeStorageValue(APP_STORAGE_KEY.Authorized);
          this.clientInfo = {};
          return result;
        })
      );
  }
  getUserInfo() {
    return this.httpClient.get(`${this.url}/auth/info`).pipe(
      map((result) => {
        return result;
      })
    );
  }
  refreshToken(accessToken: string) {
    return this.httpClient.post(
      `${this.url}/auth/refresh`,
      { accessToken },
      {
        headers: { disableErrorNotification: 'yes' },
        withCredentials: true,
      }
    );
  }

  sendResetPasswordLinkAsync(model: any) {
    return this.httpClient.post(
      `${this.url}/auth/send-reset-password-link`,
      model,
      { headers: { disableErrorNotification: 'yes' } }
    );
  }

  verifyOtp(model: any) {
    return this.httpClient.post(`${this.url}/auth/verify-otp`, model, {
      headers: { disableErrorNotification: 'yes' },
    });
  }

  resetPassword(model: any) {
    return this.httpClient.post(`${this.url}/auth/reset-password`, model);
  }
  changePassword(model: any) {
    return this.httpClient.post(`${this.url}/auth/change-password`, model);
  }
  editProfile(model: any) {
    return this.httpClient.post(`${this.url}/auth/edit-profile`, model);
  }

  getStorageValue<T>(key: string): T {
    return JSON.parse(<string>localStorage.getItem(key));
  }

  setStorageValue(option: { key: string; value: any }): void {
    if (localStorage.getItem(option.key)) {
      localStorage.removeItem(option.key);
    }
    localStorage.setItem(option.key, JSON.stringify(option.value));
  }

  removeStorageValue(key: any): void {
    localStorage.removeItem(key);
  }
  getAuthorizedPermissions(): number[] {
    return this.clientInfo.permissions || [];
  }
  updateClientInfo() {
    this.getUserInfo().subscribe((result) => {
      const authorized: ClientInfo = this.getStorageValue(
        APP_STORAGE_KEY.Authorized
      );
      this.clientInfo = result!;
      this.clientInfo.token = authorized.token;
      this.clientInfo.permissions = authorized.permissions;
      this.setStorageValue({
        key: APP_STORAGE_KEY.Authorized,
        value: this.clientInfo,
      });
    });
  }

  isAuthorized(key: number): boolean {
    if (!key) {
      return true;
    }
    return this.getAuthorizedPermissions().includes(key);
  }

  updateBrowserTab() {
    this.languageService.initialLanguage();
    this.titleService.setTitle(`${this.app?.appName} | ${this.tenant?.name}`);
    // let favIcon: HTMLLinkElement | any = document.querySelector('#favIcon');
    // favIcon.href = this.app?.iconUrl;
  }
}
