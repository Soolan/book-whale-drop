import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Coordinate, WhaleWithId} from '@shared-models/whale';
import {collection, Firestore, getDocs, limit, orderBy, query, where} from '@angular/fire/firestore';
import {MapService} from '@shared-services/map.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private mapService: MapService,
    private snackBar: MatSnackBar,
    private firestore: Firestore
  ) {}

  async getWhales(flying: boolean): Promise<WhaleWithId[]> {
    const whalesRef = collection(this.firestore, 'whales')
    const q = query(
      whalesRef,
      where('timestamps.deletedAt', flying ? '==' : '>', 0),
      orderBy(flying ? 'timestamps.updatedAt' : 'timestamps.deletedAt', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id} as WhaleWithId));
  }

  async getUserLocation(): Promise<Coordinate | undefined> {
    return new Promise<Coordinate | undefined>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation: Coordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              locationName: '', // TODO: get location name via reverse geocoding
            };
            resolve(userLocation);
          },
          (error) => {
            this.snackBar.open(error.message, 'X', {duration: 3000});
            resolve(undefined);
          },
          {enableHighAccuracy: true, timeout: 5000, maximumAge: 60000}
        );
      } else {
        this.snackBar.open('Geolocation is not supported by this browser.', 'X', {duration: 3000});
        resolve(undefined);
      }
    });
  }

  async getNearbyWhales(userLocation: Coordinate, isFlying: boolean = true): Promise<WhaleWithId[]> {
    const whales = await this.getWhales(isFlying);
    return whales
      .map((whale) => ({
        whale,
        distance: this.mapService.calculateDistanceToLine(userLocation, whale.lastSeen, whale.path[whale.completedSteps]),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.whale);
  }
}
