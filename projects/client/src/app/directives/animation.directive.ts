import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAnimation]'
})
export class AnimationDirective implements OnInit {
  @Input() animationConfig: any; // Pass animation configuration from the parent component

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Apply animation configuration to the element
    this.el.nativeElement.setAttribute('animation', this.animationConfig);
  }
}
