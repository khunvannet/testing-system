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
      <span class="text1">Create New Folder</span>
      <div class="input-add">
        <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
          <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
            <input
              type="text"
              id="title"
              name="title"
              nz-input
              placeholder="Add new test case"
              formControlName="title"
            />
          </nz-input-group>
          <ng-template #suffixIconButton>
            <button nz-button nzType="primary" [disabled]="!form.valid">
              <span nz-icon nzType="plus"></span> Add
            </button>
          </ng-template>
        </form>
      </div>
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
        text-align: center; /* Center text for smaller screens */
      }

      .input-add {
        width: 100%;
        max-width: 700px;
        margin-top: 10px;
      }
    `,
  ],
})
export class NoTestCaseComponent {
  @Output() testCaseAdded = new EventEmitter<string>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newTestCase = this.form.value.title;
      console.log('New Test Case:', newTestCase);
      this.testCaseAdded.emit(newTestCase);

      this.form.reset();
    }
  }
}
