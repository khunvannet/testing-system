import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES, Locale } from 'src/app/const';

export interface MultiLanguageInput {
  localId: string;
  val: any;
}

@Component({
  selector: 'app-language-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LanguageInputComponent,
      multi: true,
    },
  ],
  template: `
    <div>
      <nz-input-group [nzAddOnBefore]="addOnBeforeTemplate">
        <ng-container *ngIf="!rows">
          <input
            type="text"
            nz-input
            [(ngModel)]="value"
            (ngModelChange)="onValueChange()"
            [placeholder]="placeholder"
            [disabled]="disabled"
          />
        </ng-container>
        <ng-container *ngIf="rows">
          <textarea
            nz-input
            [(ngModel)]="value"
            (ngModelChange)="onValueChange()"
            [rows]="rows"
            [placeholder]="placeholder"
            [disabled]="disabled"
          ></textarea>
        </ng-container>
      </nz-input-group>
      <ng-template #addOnBeforeTemplate>
        <nz-select
          select
          [(ngModel)]="localId"
          (ngModelChange)="updateCurrentLanguageVal()"
          [nzCustomTemplate]="defaultTemplate"
          [nzDropdownMatchSelectWidth]="false"
        >
          <ng-container *ngFor="let lang of LANGUAGES">
            <nz-option
              nzCustomContent
              [nzLabel]="lang.label"
              [nzValue]="lang.key.localId"
            >
              <img
                [src]="lang.image"
                alt=""
                style="width: 16px;margin-top: -4px;"
              />
              {{ lang.label }}
            </nz-option>
          </ng-container>
        </nz-select>
        <ng-template #defaultTemplate let-selected>
          <img
            [src]="getLangImageByKey(selected.nzValue)"
            alt=""
            style="width: 16px"
          />
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep [nz-input-group-slot] {
        width: 45px !important;
        padding: 0;
      }
      ::ng-deep
        .ant-input-group-addon
        .ant-select.ant-select-single:not(.ant-select-customize-input)
        .ant-select-selector {
        padding: 0;
      }
      :host ::ng-deep [select] nz-select-arrow {
        right: 5px !important;
      }
      :host ::ng-deep [select] nz-select-item {
        padding-right: 14px !important;
      }
    `,
  ],
})
export class LanguageInputComponent implements OnInit, ControlValueAccessor {
  constructor(private translate: TranslateService) {}
  @Input() rows: any = 0;
  @Input() placeholder: any = '';
  @Input() disabled: boolean = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  LANGUAGES = LANGUAGES;
  localId: string = this.translate.currentLang || Locale.KH.localId;
  value: any;
  finalVal: any = {};
  onChange: any = () => {};
  onTouch: any = () => {};
  writeValue(val: any): void {
    try {
      if (val) {
        this.finalVal = JSON.parse(val);
      }
    } catch {}
    this.updateCurrentLanguageVal();
  }
  onValueChange() {
    this.finalVal[`${this.localId}`] = this.value;
    let jsonVal = JSON.stringify(this.finalVal);
    this.onChange(jsonVal);
    this.onTouch(jsonVal);
    this.valueChange.emit(jsonVal);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    this.LANGUAGES.forEach((x) => {
      this.finalVal[`${x.key.localId}`] = '';
    });
  }

  getLangImageByKey(localId: any) {
    return LANGUAGES.find((x) => x.key.localId == localId)?.image;
  }
  updateCurrentLanguageVal() {
    this.value = this.finalVal[`${this.localId}`];
  }
}
