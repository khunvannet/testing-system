import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { APP_STORAGE_KEY } from '../const';
import { SettingService } from '../app-setting';
import { LocalStorageService } from './localStorage.service';
import { AuthService } from './auth.service';
@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {
  constructor(
    public router: Router,
    private settingService: SettingService,
    private authService: AuthService
  ) {}
  canActivate(): boolean {
    const token = this.authService.getStorageValue<any>(
      APP_STORAGE_KEY.Authorized
    )?.token;
    if (!token) {
      this.authService.removeStorageValue(APP_STORAGE_KEY.Authorized);
      window.location.replace(
        `${this.settingService.setting.AUTH_UI_URL}/auth/login`
      );
      return false;
    }
    return true;
  }
}
