import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestCaseUiService } from './test-case-ui.service';
import { ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { HomeUiService } from '../home/home-ui.service';
import { Subject, takeUntil } from 'rxjs';
import { HomeService, Project } from '../home/home.service';

@Component({
  selector: 'app-testcase',
  template: `
    <nz-layout>
      <nz-content>
        <nz-layout>
          <nz-sider class="sub-sidebar" nzWidth="256px">
            <div class="select-project">
              <nz-select
                [(ngModel)]="selectedValue"

                [nzDropdownRender]="actionItem"
              >
                <nz-option
                 
                >
                
                </nz-option>
                <ng-template #actionItem>
                  <a class="item-action"> <i nz-icon nzType="plus"></i> Add </a>
                </ng-template>
              </nz-select>
            </div>

            <app-main-list
             
             
              
            ></app-main-list>
          </nz-sider>
        </nz-layout>

        <div class="content-test">
          <nz-header>
            <nz-input-group [nzSuffix]="suffixIconSearch">
              <input
                type="text"
                nz-input
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearch()"
              />
            </nz-input-group>
            <ng-template #suffixIconSearch>
              <span nz-icon nzType="search"></span>
            </ng-template>

            <button
              (click)="uiService.showAdd(selectedMainId)"
              class="create-project"
              nz-button
              nzType="primary"
            >
              Create Test Case
            </button>
          </nz-header>
          <app-test-case-list
            [mainId]="selectedMainId"
            [searchTerm]="searchTerm"
          ></app-test-case-list>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styles: [
    `
      .item-action {
        padding-left: 10px;
      }
      nz-select {
        width: 235px;
      }
      .select-project {
        margin: 10px;
        margin-top: 17px;
        width: 100px;
      }
      nz-input-group {
        width: 250px;
      }
      .title-menu {
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      nz-header {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
      }
      .content-test {
        width: 100%;
      }
      .sub-sidebar {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 10;
        min-height: 88vh;
        background: #fff;
      }
      nz-content {
        margin: 11px;
        display: flex;
        min-height: 92vh;
        background: #fff;
        width: 98%;
      }
      #text {
        color: #7d8597;
      }
      #text #get-start {
        margin-left: 60px;
      }
      @media (max-width: 575px) {
        .content-test {
          nz-header {
            width: 675px;
          }
        }
        .item-center {
          margin-top: 5%;
        }
        .input-search {
          width: 100%;
        }
        .large-icon {
          font-size: 20px;
        }
        .text1 {
          font-size: 10px;
        }
        @media (max-width: 768px) {
          nz-header {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 0 16px;
            display: flex;
            align-items: center;
            background: #fff;
            width: 535px;
          }
        }
      }
    `,
  ],
})
export class TestcaseComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedValue: number | null = null;
  selectedMainId: number | null = null;
  searchTerm: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    public uiService: TestCaseUiService,
    private service: HomeService,
    private projectSelectionService: ProjectSelectionService,
    public uiProject: HomeUiService
  ) {}

  ngOnInit(): void {
   
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  



 

  onSearch(): void {
    // Implement search logic here if needed
  }

}
