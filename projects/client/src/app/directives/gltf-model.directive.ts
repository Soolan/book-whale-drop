import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appGltfModel]'
})
export class GltfModelDirective implements OnInit {
  @Input() set appGltfModel(modelPath: string) {
    this.modelPath = modelPath;
  }

  private modelPath: string = '/assets/whale.gltf';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Apply the model path and animation-mixer to the element
    this.renderer.setAttribute(this.el.nativeElement, 'gltf-model', this.modelPath);
    this.renderer.setAttribute(this.el.nativeElement, 'animation-mixer', '');
  }
}
