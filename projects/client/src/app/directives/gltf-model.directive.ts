import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGltfModel]'
})
export class GltfModelDirective implements OnInit {
  @Input() modelPath: string; // Pass the path to the GLTF model from the parent component

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Apply the model path to the element
    this.el.nativeElement.setAttribute('gltf-model', this.modelPath);
  }
}
