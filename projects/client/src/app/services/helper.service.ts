import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location, WhaleWithId} from '@shared-models/whale';
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

  async getUserLocation(): Promise<Location | undefined> {
    return new Promise<Location | undefined>((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation: Location = {
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

  async getNearbyWhales(userLocation: Location, isFlying: boolean = true): Promise<WhaleWithId[]> {
    const whales = await this.getWhales(isFlying);
    return whales
      .map((whale) => ({
        whale,
        distance: this.mapService.calculateDistanceToLine(userLocation, whale.lastSeen, whale.path[whale.completedSteps]),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.whale);
  }



  interpolatePosition(lastSeen: Location, nextStep: Location, progress: number): string {
    const interpolatedLatitude = this.lerp(lastSeen.latitude, nextStep.latitude, progress);
    const interpolatedLongitude = this.lerp(lastSeen.longitude, nextStep.longitude, progress);
    return `${interpolatedLatitude} ${interpolatedLongitude} 0`;
  }

  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }

  haversine(lastSeen: Location, target: Location): number {
    const earthRadius = 6371; // Earth's radius in kilometers

    const latitude = this.toRadians(target.latitude - lastSeen.latitude);
    const longitude = this.toRadians(target.longitude - lastSeen.longitude);

    const a =
      Math.sin(latitude / 2) ** 2 +
      Math.cos(this.toRadians(lastSeen.latitude)) *
      Math.cos(this.toRadians(target.latitude)) *
      Math.sin(longitude / 2) ** 2;

    const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in kilometers
    return earthRadius * centralAngle;
  }

  toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  extractCoordinate(positionString: string): Location {
    const coordinates = positionString.split(' ').map(parseFloat);
    return {
      latitude: coordinates[0],
      longitude: coordinates[1],
      locationName: '' // You might want to improve this logic based on your requirements
    };
  }
}
