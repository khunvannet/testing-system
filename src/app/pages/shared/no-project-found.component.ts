import { Component, OnInit } from '@angular/core';
import { HomeUiService } from '../home/home-ui.service';

@Component({
  selector: 'app-no-project-found',
  template: `
    <div class="container">
      <h5 style="font-size: 36px; margin-bottom: 6px;">
        <span nz-icon nzType="info-circle" nzTheme="outline"></span>
      </h5>
      <span class="title-menu">No Projects</span>
      <p id="text">No Project data available.Create a project get to starts</p>
      <button nz-button nzType="dashed" (click)="this.uiService.showAdd()">
        Create Project
      </button>
    </div>
  `,

  styles: [
    `
      #text {
        color: #7d8597;
      }

      .title-menu {
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
      }
      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 15%;
      }
    `,
  ],
})
export class NoProjectFoundComponent implements OnInit {
  constructor(public uiService: HomeUiService) {}

  ngOnInit(): void {}
}
