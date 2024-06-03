import { Component } from '@angular/core';
import { ListUiService } from './list-ui.service';

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
              <span>All Projects</span>
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
              <a
                nz-dropdown
                nzTrigger="click"
                [nzDropdownMenu]="menu"
                nzPlacement="bottomRight"
              >
                <img [src]="selectedImageSrc" alt="" />
              </a>
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li
                    nz-menu-item
                    (click)="
                      onLanguageChange('../../../assets/images/kh_FLAG.png')
                    "
                  >
                    <img
                      class="images"
                      src="../../../assets/images/kh_FLAG.png"
                      alt=""
                    />&nbsp;
                    <span>Khmer</span>
                  </li>
                  <li
                    nz-menu-item
                    (click)="
                      onLanguageChange('../../../assets/images/en_FLAG.png')
                    "
                  >
                    <img
                      class="images"
                      src="../../../assets/images/en_FLAG.png"
                      alt=""
                    />&nbsp;
                    <span>English</span>
                  </li>
                  <li
                    nz-menu-item
                    (click)="
                      onLanguageChange('../../../assets/images/ch_FLAG.png')
                    "
                  >
                    <img
                      class="images"
                      src="../../../assets/images/ch_FLAG.png"
                      alt=""
                    />&nbsp;
                    <span>Chinese</span>
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
export class HomeComponent {
  isCollapsed = false;
  selectedValue: string | null = null;
  selectedImageSrc: string = '../../../assets/images/kh_FLAG.png';
  isFullScreen = false;
  constructor(public uiservice: ListUiService) {}

  onLanguageChange(imageSrc: string): void {
    this.selectedImageSrc = imageSrc;
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
}
