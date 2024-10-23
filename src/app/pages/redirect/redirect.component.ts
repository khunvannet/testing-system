import { Component, OnInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_STORAGE_KEY } from 'src/app/const';
import { AuthService } from 'src/app/helper/auth.service';
import { SettingService } from '../../app-setting';

@Component({
  selector: 'app-redirect',
  template: ` <div>Redirecting... {{ requestId }}</div> `,
})
export class RedirectComponent implements OnInit {
  requestId: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = params['requestId'];
      this.authService.redirectLogin({ requestId: this.requestId }).subscribe(
        (result: any) => {
          this.authService.setStorageValue({
            key: APP_STORAGE_KEY.Authorized,
            value: result,
          });
          this.authService.setStorageValue({
            key: APP_STORAGE_KEY.Tenant,
            value: result.tenant,
          });
          this.authService.setStorageValue({
            key: APP_STORAGE_KEY.App,
            value: result.app,
          });
          this.authService.updateBrowserTab();
          this.router.navigate(['home']).then();
          this.loading = false;
        },
        (err: HttpErrorResponse) => {
          // window.location.replace(
          //   `${this.settingService.setting.AUTH_UI_URL}/auth/login`
          // );
        }
      );
    });
  }
}
