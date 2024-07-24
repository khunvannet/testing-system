import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-no-test-case',
  template: `
    <div class="content-item">
      <span
        class="large-icon"
        nz-icon
        nzType="file-add"
        nzTheme="outline"
      ></span>
      <span class="text1">Create New Test Case</span>
    </div>
  `,
  styles: [
    `
      .large-icon {
        font-size: 32px;
        padding: 5px;
        overflow: hidden;
        cursor: pointer;
      }
      .content-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 20%;
      }

      .text1 {
        font-size: 16px;
        font-weight: bold;
        color: #003049;
        margin-top: 10px;
        text-align: center;
      }
    `,
  ],
})
export class NoTestCaseComponent {
  constructor() {}
}
