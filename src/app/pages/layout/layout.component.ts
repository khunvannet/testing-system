import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HomeUiService } from '../home/home-ui.service';
import { TranslateService } from '@ngx-translate/core';
import { Project } from '../home/home.service';
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
        <div class="select-project">
          <app-select-pro>
          </app-select-pro>
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
            <a routerLink="/test/dashboard">
              <i nz-icon nzType="dashboard" nzTheme="outline"></i>
              <span>{{'Dashboard' | translate}}</span>
            </a>
          </li>
          <li nz-menu-item routerLinkActive="active">
            <a routerLink="/test/test_cases">
              <i nz-icon nzType="folder" nzTheme="outline"></i>
              <span>{{'Test Cases' | translate}}</span>
            </a>
          </li>
          <li nz-menu-item routerLinkActive="active">
            <a routerLink="/test/test_run">
              <i nz-icon nzType="code" nzTheme="outline"></i>
              <span>{{'Test Run' | translate}}</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="header-app">
            <div
              style="background-color: #f0f0f0; font-size: 17px; border-radius: 5px; padding: 5px 15px; height: 25px; display: flex; align-items: center; justify-content: center; margin-top: 20px;"
            >
              <span nz-icon nzType="cloud-server" nzTheme="outline"></span>
              <span>S9 Server</span>
            </div>
            <div class="header" style="margin-left: 10px;">
            <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
                <img
                
                  [src]="selectLang.flag"
                  [alt]="selectLang.name"
                />
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
            <div style="margin-top: 5px; margin-left: 10px;">
              <i
                nz-icon
                nzType="appstore"
                nzTheme="outline"
                style="color: #1890ff; font-size: 20px;"
              ></i>
            </div>
            <a (click)="toggleFullScreen()">
              <div style="margin-top: 5px; margin-left: 10px;">
                <span
                  nz-icon
                  [nzType]="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
                  nzTheme="outline"
                  style="color: #1890ff; font-size: 20px;"
                ></span>
              </div>
            </a>
            <div style="margin-top: 2px; margin-left: 10px;">
              <span
                nz-icon
                nzType="user"
                nzTheme="outline"
                style="font-size: 18px; border-radius: 50%; width: 20px; height: 20px; background: #1890ff; color: #fff;"
              ></span>
            </div>
            <div style="margin-top: 2px; margin-left: 10px;">
              <span style="color: #1890ff; font-size: 20px;">KhunVannet</span>
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
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
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
      code: 'kh',
      flag: '../../../assets/images/Khmer-logo.svg',
    },
  ];
  isFullScreen = false;
  isLoading = false;
  constructor(
    public uiservice: HomeUiService,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    const storeLang = localStorage.getItem('selectLang') || this.defualtLang;
    this.selectLang =
      this.languages.find((lang) => lang.code === storeLang) ||
      this.getDefaultLang();
    this.translateService.use(this.selectLang.code);
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
    localStorage.setItem('selectLang', lang.code);
  }
}
