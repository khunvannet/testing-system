import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
          <nz-select
            nzShowSearch
            nzPlaceHolder="Select Project"
            [(ngModel)]="selectedValue"
            (ngModelChange)="onProjectChange($event)"
          >
            <nz-option
              nzLabel="All Projects"
              nzValue="All Projects"
            ></nz-option>
            <nz-option nzLabel="POS Admin" nzValue="POS Admin"></nz-option>
            <nz-option nzLabel="Fitness" nzValue="Fitness"></nz-option>
            <nz-option nzLabel="POS" nzValue="tom"></nz-option>
          </nz-select>
        </div>

        <ul
          nz-menu
          nzMode="inline"
          [nzInlineCollapsed]="isCollapsed"
          class="menu-layout"
        >
          <li nz-menu-item>
            <a routerLink="/test/dashboard">
              <i nz-icon nzType="dashboard" nzTheme="outline"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li nz-menu-item>
            <a routerLink="/test/test_cases">
              <i nz-icon nzType="folder" nzTheme="outline"></i>
              <span>Test Cases</span>
            </a>
          </li>
          <li nz-menu-item>
            <a routerLink="/test/test_run">
              <i nz-icon nzType="code" nzTheme="outline"></i>
              <span>Test Run</span>
            </a>
          </li>
          <div class="setting-sider">
            <li nz-menu-item>
              <a routerLink="/test/settings">
                <i nz-icon nzType="setting" nzTheme="outline"></i>
                <span>Settings</span>
              </a>
            </li>
          </div>
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
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [
    `
      .setting-sider {
        position: absolute;
        bottom: 0;
        margin-bottom: 50px;
      }
      .header-app {
        display: flex;
        margin-right: 20px;
        justify-content: flex-end;
      }
      .header img,
      .images {
        width: 20px;
        height: 20px;
      }

      :host {
        display: flex;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .title-menu {
        font-size: x-large;
        font-weight: bold;
      }
      .menu-sidebar {
        position: relative;
        z-index: 10;
        min-height: 100vh;
        background: #fff;
      }

      .header-trigger {
        height: 64px;
        padding: 20px 24px;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s, padding 0s;
      }
      .trigger:hover {
        color: #1890ff;
      }

      nz-header {
        padding: 0;
        width: 100%;
        z-index: 2;
        background: #fff;
      }

      .inner-content {
        padding: 24px;
        background: #fff;
        height: 100%;
        border-radius: 4px;
      }
      .title-menu {
        font-size: x-large;
        font-weight: bold;
      }
      .menu-centered li {
        margin-top: 15px;
        background: #ebeaea;
        border-radius: 5px;
      }

      .menu-layout li {
        margin-top: 10px;
        border-radius: 5px;
        width: 240px;
        margin-left: 10px;
      }
      .select-project {
        nz-select {
          width: 240px;
        }
        margin-left: 10px;
        margin-top: 20px;
      }

      @media (max-width: 575px) {
        .select-project {
          nz-select {
            width: 80px;
          }
          margin: 5px 0;
          padding: 0 10px;
          margin-left: -10px;
        }
        .menu-layout li {
          margin-top: 10px;
          border-radius: 5px;
          width: 90px;
          margin-left: -10px;
        }
        .header-app {
          display: flex;
          margin-right: -20px;
          justify-content: flex-end;
          width: 800px;
        }
        .header img,
        .images {
          width: 20px;
          height: 20px;
        }
        nz-content {
          width: 810px;
        }
      }
      @media (min-width: 576px) and (max-width: 767px) {
        .select-project {
          nz-select {
            width: 80px;
          }
          margin: 5px 0;
          padding: 0 10px;
          margin-left: -10px;
        }
        .menu-layout li {
          margin-top: 10px;
          border-radius: 5px;
          width: 90px;
          margin-left: -10px;
        }
        nz-content {
          width: 810px;
        }
        .header-app {
          display: flex;
          margin-right: -20px;
          justify-content: flex-end;
          width: 800px;
        }
        .header img,
        .images {
          width: 20px;
          height: 20px;
        }
      }
      @media (min-width: 768px) and (max-width: 991px) {
        nz-content {
          width: 800px;
        }

        .header-app {
          display: flex;
          margin-right: -20px;
          justify-content: flex-end;
          width: 800px;
        }
        .header img,
        .images {
          width: 20px;
          height: 20px;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  selectedValue: string | null = null;
  selectedImageSrc: string = '../../../assets/images/kh_FLAG.png';
  isFullScreen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onProjectChange(selectedValue: string): void {
    if (selectedValue === 'All Projects') {
      this.router.navigate(['home']);
    }
  }

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
