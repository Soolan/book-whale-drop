import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '@shared-services/map.service';
import {Location, Whale} from '@shared-models/whale';
import {HelperService} from '../services/helper.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('map', {static: false}) mapContainer!: ElementRef;

  flyingWhales: Whale[] = [];
  retiredWhales: Whale[] = [];
  selectedFlying = 0;
  selectedRetired = 0;
  userLocation: Location | undefined;
  isInitialized = false;

  constructor(
    private helperService: HelperService,
    private mapService: MapService,
    private snackBar: MatSnackBar,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.userLocation = await this.helperService.getUserLocation();
    this.flyingWhales = this.userLocation ?
      await this.helperService.getNearbyWhales(this.userLocation, true) :
      await this.helperService.getWhales(true);
    this.retiredWhales = await this.helperService.getWhales(false); // changed to retired
  }

  ngAfterViewInit() {
    this.mapService.initMap(this.mapContainer);
  }

  ngAfterViewChecked() {
    if (this.flyingWhales.length > 0 && !this.isInitialized) {
      this.setMarkers(true);
      this.isInitialized = true;
    }
  }

  setMarkers(isActive: boolean) {
    const whale =
      isActive ? this.flyingWhales[this.selectedFlying] : this.retiredWhales[this.selectedRetired];
    this.snackBar.open(whale.description, 'X', {duration: 6000});
    this.mapService.addPathMarkers(whale.path);
    this.mapService.setPolylines(whale.path, whale.completedSteps);
    this.mapService.addWhaleMarker(whale, isActive);
    if (this.userLocation) {
      this.mapService.addUserMarker(this.userLocation);
    }
  }
}
