import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-search',
  template: `
    <nz-input-group [nzSuffix]="suffixIconSearch">
        <input
        type="text"
        nz-input
        [(ngModel)]="searchQuery"
        (ngModelChange)="onSearchQueryChange($event)"
        (keydown)="handleKeyDown($event)"
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
})
export class InputSearchComponent{
 @Input() searchQuery: string = '';
 @Output() searchQueryChange: EventEmitter<string> =
 new EventEmitter<string>();
@ Output() search: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search.emit(this.searchQuery);
    }
  }
  onSearchQueryChange(value: string): void {
    this.searchQuery = value;
    this.searchQueryChange.emit(this.searchQuery);
  }
}
