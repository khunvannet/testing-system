import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Project } from '../home/home.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { Subscription } from 'rxjs';

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
            [(ngModel)]="selectedValue"
            (ngModelChange)="onProjectChange($event)"
          >
            <nz-option
              nzLabel="All Projects"
              nzValue="All Projects"
            ></nz-option>
            <nz-option
              *ngFor="let data of projects"
              [nzLabel]="data.name"
              [nzValue]="data.id"
            ></nz-option>
          </nz-select>
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
              <span>Dashboard</span>
            </a>
          </li>
          <li nz-menu-item routerLinkActive="active">
            <a routerLink="/test/test_cases">
              <i nz-icon nzType="folder" nzTheme="outline"></i>
              <span>Test Cases</span>
            </a>
          </li>
          <li nz-menu-item routerLinkActive="active">
            <a routerLink="/test/test_run">
              <i nz-icon nzType="code" nzTheme="outline"></i>
              <span>Test Run</span>
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
export class LayoutComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  selectedValue: string | number | null = null;
  selectedImageSrc: string = '../../../assets/images/kh_FLAG.png';
  isFullScreen = false;
  projects: Project[] = [];
  isLoading = false;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private service: HomeService,
    private projectSelectionService: ProjectSelectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    const storedProject = this.projectSelectionService.getSelectedProject();
    if (storedProject) {
      this.selectedValue = storedProject.id;
    }
    this.subscriptions.add(
      this.projectSelectionService.selectedProject$.subscribe((project) => {
        this.selectedValue = project ? project.id : null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onProjectChange(selectedValue: string | number | null): void {
    const id = typeof selectedValue === 'number' ? selectedValue : null;
    const name =
      typeof selectedValue === 'string'
        ? selectedValue
        : this.getProjectName(selectedValue as number);

    this.projectSelectionService.setSelectedProject({ id, name });

    if (selectedValue === 'All Projects' || selectedValue === null) {
      this.router.navigate(['home']);
    }
  }

  private getProjectName(projectId: number | null): string {
    const project = this.projects.find((proj) => proj.id === projectId);
    return project ? project.name : '';
  }

  onLanguageChange(imageSrc: string): void {
    this.selectedImageSrc = imageSrc;
  }

  toggleFullScreen(): void {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .then(() => (this.isFullScreen = true))
        .catch((err) => console.log(`Error: ${err.message}`));
    } else {
      document
        .exitFullscreen()
        .then(() => (this.isFullScreen = false))
        .catch((err) => console.log(`Error: ${err.message}`));
    }
  }

  getAllProjects(): void {
    this.isLoading = true;
    this.service.getSelect().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.isLoading = false;
      },
    });
  }
}
