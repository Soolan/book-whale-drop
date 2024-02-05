import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[gps-new-entity-place]'
})
export class GpsNewEntityPlaceDirective implements OnChanges {
  @Input('gps-new-entity-place') gpsLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 };

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gpsLocation']) {
      this.updateEntityPosition();
    }
  }

  private updateEntityPosition(): void {
    const { latitude, longitude } = this.gpsLocation;
    const positionString = `${latitude} ${longitude} 0`;
    this.el.nativeElement.setAttribute('position', positionString);
  }
}
