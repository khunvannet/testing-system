import { Component, Input, OnInit } from '@angular/core';
import { HomeUiService } from '../project/project-ui.service';
import { TranslateService } from '@ngx-translate/core';
import { en_US, km_KH, NzI18nService } from 'ng-zorro-antd/i18n';
import { AuthService } from 'src/app/helper/auth.service';
import { SettingService } from 'src/app/app-setting';
export interface Language {
  name: string;
  code: string;
  flag: string;
}
@Component({
  selector: 'app-layout',
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzCollapsible
        nzWidth="256px"
        nzBreakpoint="md"
        [(nzCollapsed)]="isCollapsed"
        [nzTrigger]="null"
      >
        <div class="logo">
          <img
            src="assets/images/quality-control_3270362.png"
            alt="Quality Control Image"
            style="width: 75px; height: 75px;"
          />
        </div>
        <ul
          nz-menu
          nzMode="inline"
          [nzInlineCollapsed]="isCollapsed"
          class="menu-layout"
        >
          <li
            nz-menu-item
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <a routerLink="/home">
              <i nz-icon nzType="dashboard" nzTheme="outline"></i>
              <span>{{ 'Dashboard' | translate }}</span>
            </a>
          </li>
          <li
            nz-menu-item
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <a routerLink="/project">
              <i nz-icon nzType="project" nzTheme="outline"></i>
              <span>{{ 'Projects' | translate }}</span>
            </a>
          </li>
          <li nz-menu-item routerLinkActive="active">
            <a routerLink="/test_cases">
              <i nz-icon nzType="folder" nzTheme="outline"></i>
              <span>{{ 'Test Cases' | translate }}</span>
            </a>
          </li>
          <li nz-menu-item routerLinkActive="active">
            <a routerLink="/test_run">
              <i nz-icon nzType="code" nzTheme="outline"></i>
              <span>{{ 'Test Run' | translate }}</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="header-app">
            <!-- Server indicator -->
            <div class="tenant">
              <img [src]="authService.tenant?.logo" alt="tenant" />
              <span>{{ authService.tenant?.name }}</span>
            </div>

            <!-- Language selector -->
            <div class="language-selector">
              <div
                nz-dropdown
                nzTrigger="click"
                [nzDropdownMenu]="menu"
                nzPlacement="bottomRight"
              >
                <img [src]="selectLang.flag" [alt]="selectLang.name" />
              </div>
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu style="min-width: 140px;">
                  <li
                    *ngFor="let lang of languages"
                    nz-menu-item
                    (click)="switchLang(lang)"
                    style="padding-left: 15px; display:flex; justify-content:space-between;"
                  >
                    <div>
                      <img
                        style=" width: 20px; height: 20px; margin-right: 10px;"
                        [src]="lang.flag"
                        [alt]="lang.name"
                      />
                      {{ lang.name }}
                    </div>
                    <span *ngIf="lang.code === selectLang.code">✔️</span>
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>

            <!-- App store icon -->
            <a class="header-icon" (click)="redirectToMainUrl()">
              <i nz-icon nzType="appstore" nzTheme="outline"></i>
            </a>
            <!-- Fullscreen toggle -->
            <a (click)="toggleFullScreen()" class="header-icon">
              <span
                nz-icon
                [nzType]="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
                nzTheme="outline"
              ></span>
            </a>

            <!-- User avatar -->
            <a class="user-avatar" (click)="redirectToViewProfileUrl()">
              <span nz-icon nzType="user" nzTheme="outline"></span>
            </a>

            <!-- Username -->
            <div class="username">
              <span>{{ name }}</span>
            </div>
          </div>
        </nz-header>
        <nz-content>
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styleUrls: ['../../../assets/scss/layout.component.scss'],
  styles: [
    `
      .tenant {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 28px;
        font-size: 17px;
        padding: 5px 15px;
        border-radius: 5px;
        background-color: #f0f0f0;
        color: black;
        cursor: default;
        margin-right: 10px;

        img {
          width: 18px;
          margin-right: 4px;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  selectLang!: Language;
  readonly defaultLang = 'en';
  isFullScreen = false;
  name = '';

  readonly languages: Language[] = [
    {
      name: 'English',
      code: 'en',
      flag: 'assets/images/en_FLAG.png',
    },
    {
      name: 'Khmer',
      code: 'km',
      flag: 'assets/images/kh_FLAG.png',
    },
  ];

  constructor(
    public uiService: HomeUiService,
    private translateService: TranslateService,
    private i18n: NzI18nService,
    public authService: AuthService,
    public settingService: SettingService
  ) {}

  ngOnInit(): void {
    const storedLang = localStorage.getItem('selectedLang') || this.defaultLang;
    this.selectLang = this.getLanguage(storedLang);
    this.setLanguage(this.selectLang);
    this.name =
      this.authService.clientInfo.fullName?.charAt(0).toUpperCase()! +
      this.authService.clientInfo.fullName?.slice(1);
  }

  toggleFullScreen(): void {
    if (!document.fullscreenElement) {
      this.enterFullScreen();
    } else {
      this.exitFullScreen();
    }
  }

  switchLang(lang: Language): void {
    this.selectLang = lang;
    this.setLanguage(lang);
    localStorage.setItem('selectedLang', lang.code);
  }

  private getLanguage(code: string): Language {
    return (
      this.languages.find((lang) => lang.code === code) || this.getDefaultLang()
    );
  }

  private getDefaultLang(): Language {
    return this.getLanguage(this.defaultLang);
  }

  private setLanguage(lang: Language): void {
    this.translateService.use(lang.code);
    this.i18n.setLocale(lang.code === 'km' ? km_KH : en_US);
  }

  private enterFullScreen(): void {
    document.documentElement
      .requestFullscreen()
      .then(() => (this.isFullScreen = true))
      .catch(this.handleFullScreenError);
  }

  private exitFullScreen(): void {
    document
      .exitFullscreen()
      .then(() => (this.isFullScreen = false))
      .catch(this.handleFullScreenError);
  }

  private handleFullScreenError(err: Error): void {
    console.error(`Fullscreen error: ${err.message} (${err.name})`);
  }
  redirectToMainUrl() {
    // console.log(this.settingService.setting.AUTH_UI_URL);

    window.open(
      `${this.settingService.setting.AUTH_UI_URL}/appcenter`,
      'app-center'
    );
  }
  redirectToViewProfileUrl() {
    window.open(
      `${this.settingService.setting.AUTH_UI_URL}/appcenter/user-view`,
      'app-center'
    );
  }
}
