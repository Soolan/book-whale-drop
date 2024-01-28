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
export class MapComponent implements OnInit, AfterViewInit{
  @ViewChild('map', {static: false}) mapContainer!: ElementRef;

  flyingWhales: Whale[] = [];
  retiredWhales: Whale[] = [];
  selectedFlying = 0;
  selectedRetired = 0;

  constructor(
    private mapService: MapService,
    private snackBar: MatSnackBar,
    private firestore: Firestore
  ) {
  }

  ngAfterViewInit() {
    this.mapService.initMap(this.mapContainer);
    setTimeout(() => {
      this.setMarkers(this.flyingWhales[this.selectedFlying], false);
    }, 100)
  }


  async ngOnInit(): Promise<void> {
    const userLocation = await this.getUserLocation();
    if (userLocation) {
      const flyingWhales = await this.getWhales(false);
      this.flyingWhales = this.orderByDistance(userLocation, flyingWhales);
    } else {
      this.snackBar.open('Unable to determine your location.', 'X', {duration: 3000});
      this.flyingWhales = await this.getWhales(false);
    }
    this.retiredWhales = await this.getWhales(true);
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
            };
            resolve(userLocation);
          },
          (error) => {
            this.snackBar.open(error.message, 'X', {duration: 3000});
            resolve(undefined);
          }
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

  setMarkers(whale: Whale, isActive: boolean) {
    this.snackBar.open(whale.name, 'X', {duration: 3000});
    this.mapService.addPathMarkers(whale.path);
    this.mapService.setPolylines(whale.path, whale.completedSteps);
    this.mapService.addWhaleMarker(whale, isActive);
  }
}
