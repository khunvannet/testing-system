import { Component, EventEmitter, Input, OnInit } from '@angular/core';

import { Project, ProjectSelectionService } from 'src/app/helper/projectselection.service';
import { HomeService } from '../../home/home.service';

@Component({
  selector: 'app-main-test',
  template: `
    <div class="select-project">
      <nz-select
        [(ngModel)]="selectedValue"
       
      >
        <nz-option
       
        ></nz-option>
      </nz-select>
    </div>

    <div>
      <app-main-list
        [projectId]="selectedValue"
        (mainId)="handleMainId($event)"
      ></app-main-list>
    </div>
  `,
  styles: [
    `
      ::ng-deep
        .ant-select-single.ant-select-show-arrow
        .ant-select-selection-item {
        width: 210px;
      }
      ::ng-deep
        .ant-select:not(.ant-select-customize-input)
        .ant-select-selector {
        width: 235px;
      }
      .select-project {
        margin: 10px;
        margin-top: 17px;
        width: 100px;
      }
    `,
  ],
})
export class MainTestComponent implements OnInit {
  projects: Project[] = [];
  selectedValue: number | null = null;
  selectedMainId: number | null = null;
  constructor(
    private service: HomeService,
    private projectSelectionService: ProjectSelectionService
  ) {}

  ngOnInit(): void {
    
    const storedProject = this.projectSelectionService.getSelectedProject();
    if (storedProject) {
      this.selectedValue = storedProject.id;
    }

    this.projectSelectionService.selectedProject$.subscribe((project) => {
      this.selectedValue = project ? project.id : null;
    });
  }

  
 
  handleMainId(id: number): void {
    this.selectedMainId = id;
    console.log('Selected Main ID:', this.selectedMainId);
  }
}
