import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements AfterContentInit{
  @Input() public autofocus!: boolean;

  public constructor(private el: ElementRef) {

  }

  public ngAfterContentInit() {

    setTimeout(() => {

      this.el.nativeElement.focus();

    }, 500);

  }

}
