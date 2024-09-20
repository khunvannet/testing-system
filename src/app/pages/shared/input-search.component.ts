import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-filter-input',
  template: `
    <nz-input-group [nzSuffix]="suffixIconSearch">
      <input
        type="text"
        nz-input
        [(ngModel)]="value"
        (keyup.enter)="filterTestChanged()"
      />
    </nz-input-group>
    <ng-template #suffixIconSearch>
      <span nz-icon nzType="search"></span>
    </ng-template>
  `,
  styles: [
    `
      nz-input-group {
        width: 250px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class InputSearchComponent {
  @Input() value: string = '';
  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();

  filterTestChanged(): void {
    this.filterChanged.emit(this.value.trim());
  }
}
