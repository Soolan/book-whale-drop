// position.directive.ts
import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[position]'
})
export class PositionDirective implements OnChanges {
  @Input() position: string = '0 0 0';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['position']) {
      this.updateEntityPosition();
    }
  }

  private updateEntityPosition(): void {
    this.el.nativeElement.setAttribute('position', this.position);
  }
}
