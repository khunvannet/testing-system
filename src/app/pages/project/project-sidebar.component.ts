import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { en_US, km_KH, NzI18nService } from 'ng-zorro-antd/i18n';
import { HomeUiService } from './project-ui.service';

export interface Language {
  name: string;
  code: string;
  flag: string;
}
@Component({
  selector: 'app-home',
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
        <ul
          nz-menu
          nzMode="inline"
          [nzInlineCollapsed]="isCollapsed"
          class="menu-centered"
        >
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/home">
              <i nz-icon nzType="home" nzTheme="outline"></i>
              <span>{{ 'All Projects' | translate }}</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="header-app">
            <div class="server-info">
              <span nz-icon nzType="cloud-server" nzTheme="outline"></span>
              <span>S9 Server</span>
            </div>
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
                    [ngClass]="{ active: lang.code === selectLang.code }"
                    style="padding-left: 15px;"
                  >
                    <img
                      class="flag"
                      style=" width: 20px;height: 20px; margin-right: 10px;"
                      [src]="lang.flag"
                      [alt]="lang.name"
                    />
                    {{ lang.name }}
                    <span *ngIf="lang.code === selectLang.code">✔️</span>
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>
            <div class="header-icon">
              <i nz-icon nzType="appstore" nzTheme="outline"></i>
            </div>
            <a class="header-icon" (click)="toggleFullScreen()">
              <span
                nz-icon
                [nzType]="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
                nzTheme="outline"
              ></span>
            </a>
            <div class="user-info">
              <span
                nz-icon
                nzType="user"
                nzTheme="outline"
                class="user-avatar"
              ></span>
              <span class="username">KhunVannet</span>
            </div>
          </div>
        </nz-header>
        <nz-content>
          <div class="inner-content">
            <app-list></app-list>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styleUrls: ['../../../assets/scss/home.component.scss'],
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  isFullScreen = false;
  selectLang!: Language;
  readonly defaultLang = 'en';

  readonly languages: Language[] = [
    {
      name: 'English',
      code: 'en',
      flag: '../../../assets/images/English-logo.svg',
    },
    {
      name: 'Khmer',
      code: 'km',
      flag: '../../../assets/images/Khmer-logo.svg',
    },
  ];

  constructor(
    public uiservice: HomeUiService,
    private translateService: TranslateService,
    private i18n: NzI18nService
  ) {}

  ngOnInit(): void {
    this.initializeLanguage();
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
    this.translateService.use(lang.code);
    this.i18n.setLocale(lang.code === 'km' ? km_KH : en_US);
    localStorage.setItem('selectedLang', lang.code);
  }

  private initializeLanguage(): void {
    const storedLang = localStorage.getItem('selectedLang') || this.defaultLang;
    this.selectLang =
      this.languages.find((lang) => lang.code === storedLang) ||
      this.getDefaultLang();
    this.translateService.use(this.selectLang.code);
    this.i18n.setLocale(this.selectLang.code === 'km' ? km_KH : en_US);
  }

  private getDefaultLang(): Language {
    return this.languages.find((lang) => lang.code === this.defaultLang)!;
  }

  private enterFullScreen(): void {
    document.documentElement
      .requestFullscreen()
      .then(() => (this.isFullScreen = true))
      .catch((err) => this.logFullScreenError('enable', err));
  }

  private exitFullScreen(): void {
    document
      .exitFullscreen()
      .then(() => (this.isFullScreen = false))
      .catch((err) => this.logFullScreenError('disable', err));
  }

  private logFullScreenError(action: string, err: Error): void {
    console.log(
      `Error attempting to ${action} full-screen mode: ${err.message} (${err.name})`
    );
  }
}
