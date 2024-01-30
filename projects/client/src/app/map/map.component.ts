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
    this.flyingWhales = this.userLocation ?
      await this.getNearbyWhales():
      await this.getWhales(true);
    this.retiredWhales = await this.getWhales(false); // changed to retired
  }

  ngAfterViewInit() {
    this.mapService.initMap(this.mapContainer);
    setTimeout(() => {
      this.setMarkers(true);
    }, 1000)
  }

  async getWhales(flying: boolean): Promise<Whale[]> {
    const whalesRef = collection(this.firestore, 'whales');
    const q = query(
      whalesRef,
      where("timestamps.deletedAt", flying ? "==" : ">", 0), // changed logic
      orderBy(flying ? "timestamps.updatedAt" : "timestamps.deletedAt", "desc"), // changed logic
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

  async getNearbyWhales(): Promise<Whale[]> {
    const whales = await this.getWhales(true);
    return whales.map((whale) => ({
        whale,
        distance: this.mapService.calculateDistanceToLine(
          this.userLocation!,
          whale.lastSeen,
          whale.path[whale.completedSteps]
        ),
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
