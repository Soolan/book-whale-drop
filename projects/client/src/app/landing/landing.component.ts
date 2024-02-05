import { Component } from '@angular/core';
import {CameraComponent} from './camera/camera.component';
import {MatDialog} from '@angular/material/dialog';
import {Coordinate, Whale} from '@shared-models/whale';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  userLocation!: Coordinate; // Update the type based on your requirements
  whales: Whale[] = []; // Update the type based on your requirements
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  camera(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Find the closest whale within 5km range
        const closestWhale = this.findClosestWhale(this.userLocation);

        if (closestWhale && closestWhale.distance <= 5) {
          // Open the camera with AR integration
          this.dialog.open(CameraComponent, {
            disableClose: true,
            panelClass: 'camera-dialog',
            data: { userLocation: this.userLocation, closestWhale },
          });
        } else {
          this.snackBar.open('No whales within range.', 'X', { duration: 5000 });
        }
      },
      (error) => this.snackBar.open(error.message, 'X', { duration: 5000 })
    );
  }

  findClosestWhale(userLocation: any): { whale: Whale; distance: number } | null {
    // Implement the logic to find the closest whale based on userLocation
    // Return an object { whale, distance } or null if no whales are found
    // Update the logic based on your requirements
    return null;
  }
}
