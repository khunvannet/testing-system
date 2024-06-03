import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result-found',
  template: `
    <div class="container">
      <h5 style="font-size: 36px; margin-bottom: 6px;">
        <i nz-icon nzType="file-search" nzTheme="outline"></i>
      </h5>
      <h5>RowNotFound</h5>
    </div>
  `,
  styleUrls: ['./no-result-found.component.scss'],
})
export class NoResultFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
