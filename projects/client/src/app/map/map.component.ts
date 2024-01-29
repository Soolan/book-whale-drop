import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {collection, Firestore, getDocs, limit, orderBy, query, where} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '@shared-services/map.service';
import {Coordinate, Whale} from '@shared-models/whale';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map', {static: false}) mapContainer!: ElementRef;

  flyingWhales: Whale[] = [];
  retiredWhales: Whale[] = [];
  selectedFlying = 0;
  selectedRetired = 0;
  userLocation: Coordinate | undefined;

  constructor(
    private mapService: MapService,
    private snackBar: MatSnackBar,
    private firestore: Firestore
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.userLocation = await this.getUserLocation();
    if (this.userLocation) {
      const flyingWhales = await this.getWhales(false);
      this.flyingWhales = this.orderByDistance(this.userLocation, flyingWhales);
    } else {
      this.flyingWhales = await this.getWhales(false);
    }
    this.retiredWhales = await this.getWhales(true);
  }

  ngAfterViewInit() {
    this.mapService.initMap(this.mapContainer);
    setTimeout(() => {
      this.setMarkers(true);
    }, 1000)
  }

  async getWhales(retired: boolean): Promise<Whale[]> {
    const whalesRef = collection(this.firestore, 'whales');
    const q = query(
      whalesRef,
      where("timestamps.deletedAt", retired ? ">" : "==", 0),
      orderBy(retired ? "timestamps.deletedAt" : "timestamps.updatedAt", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Whale);
  }

  async getUserLocation(): Promise<Coordinate | undefined> {
    return new Promise<Coordinate | undefined>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation: Coordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              locationName: '' // TODO: get location name via reverse geocoding
            };
            resolve(userLocation);
          },
          (error) => {
            this.snackBar.open(error.message, 'X', {duration: 3000});
            resolve(undefined);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
        );
      } else {
        this.snackBar.open('Geolocation is not supported by this browser.', 'X', {duration: 3000});
        resolve(undefined);
      }
    });
  }

  orderByDistance(userLocation: Coordinate, whales: Whale[]): Whale[] {
    return whales
      .map((whale) => ({
        whale,
        distance: this.mapService.calculateDistanceToLine(userLocation, whale.lastSeen, whale.path[whale.completedSteps]),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.whale);
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
