import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { en_US, km_KH, NzI18nService } from 'ng-zorro-antd/i18n';
import { HomeUiService } from './home-ui.service';

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
            <div
              style=" background-color: #f0f0f0; font-size:17px; border-radius:5px; padding:5px 15px; height:25px; display: flex; align-items: center; justify-content: center;margin-top:20px;"
            >
              <span nz-icon nzType="cloud-server" nzTheme="outline"></span>
              <span>S9 Server</span>
            </div>
            <div class="header" style="margin-left:10px;">
              <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
                <img [src]="selectLang.flag" [alt]="selectLang.name" />
              </div>
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li
                    *ngFor="let lang of languages"
                    nz-menu-item
                    (click)="switchLang(lang)"
                    [ngClass]="{ active: lang.code === selectLang.code }"
                  >
                    <img class="flag" [src]="lang.flag" [alt]="lang.name" />
                    {{ lang.name }}
                    <span *ngIf="lang.code === selectLang.code">✔️</span>
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>
            <div style="margin-top: 5px; margin-left:10px;">
              <i
                nz-icon
                nzType="appstore"
                nzTheme="outline"
                style="color: #1890ff; font-size:20px;"
              ></i>
            </div>
            <a (click)="toggleFullScreen()">
              <div style="margin-top: 5px; margin-left:10px;">
                <span
                  nz-icon
                  [nzType]="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
                  nzTheme="outline"
                  style="color:#1890ff; font-size:20px;"
                ></span></div
            ></a>
            <div style="margin-top:2px;margin-left:10px;">
              <span
                nz-icon
                nzType="user"
                nzTheme="outline"
                style=" font-size:18px;border-radius:50%;width:20px;height:20px;background:#1890ff; color:#fff;"
              ></span>
            </div>
            <div style="margin-top:2px;margin-left:10px;">
              <span style="color: #1890ff;font-size:20px;">KhunVannet</span>
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
  styles: [
    `
      @media (max-width: 575px) {
        .inner-content {
          width: 780px;
        }
        .header-app {
          display: flex;
          margin-right: 20px;
          justify-content: flex-end;
          width: 800px;
        }
        ::ng-deep .ant-layout.ant-layout-has-sider > .ant-layout {
          width: 800px;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  isFullScreen = false;
  selectLang!: Language;
  defualtLang: string = 'en';

  languages: Language[] = [
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
    const storeLang = localStorage.getItem('selectedLang') || this.defualtLang;
    this.selectLang =
      this.languages.find((lang) => lang.code === storeLang) ||
      this.getDefaultLang();
    this.translateService.use(this.selectLang.code);
    this.i18n.setLocale(this.selectLang.code === 'km' ? km_KH : en_US);
  }

  toggleFullScreen(): void {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .then(() => {
          this.isFullScreen = true;
        })
        .catch((err) => {
          console.log(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          this.isFullScreen = false;
        })
        .catch((err) => {
          console.log(
            `Error attempting to disable full-screen mode: ${err.message} (${err.name})`
          );
        });
    }
  }
  private getDefaultLang(): Language {
    return this.languages.find((lang) => lang.code === this.defualtLang)!;
  }
  switchLang(lang: Language): void {
    this.selectLang = lang;
    this.translateService.use(lang.code);
    this.i18n.setLocale(lang.code === 'km' ? km_KH : en_US);
    localStorage.setItem('selectedLang', lang.code);
  }
}
