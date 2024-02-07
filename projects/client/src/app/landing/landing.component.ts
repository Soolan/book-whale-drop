import {Component, OnInit} from '@angular/core';
import {CameraComponent} from './camera/camera.component';
import {MatDialog} from '@angular/material/dialog';
import {Location, Whale} from '@shared-models/whale';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HelperService} from '../services/helper.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  userLocation: Location | undefined; // Update the type based on your requirements
  whales: Whale[] = []; // Update the type based on your requirements
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private helperService: HelperService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initUserAndWhales();
  }

  async initUserAndWhales(): Promise<void> {
    this.userLocation = await this.helperService.getUserLocation();
    if (this.userLocation) {
      this.whales = await this.helperService.getNearbyWhales(this.userLocation);
    } else {
      // Handle the case where user location is not available
      this.snackBar.open('User location not available.', 'X', { duration: 5000 });
    }
  }

  camera(): void {
    if (this.userLocation) {
      const dialogRef = this.dialog.open(CameraComponent, {
        disableClose: true,
        panelClass: 'camera-dialog',
        data: { userLocation: this.userLocation, closestWhales: this.whales },
      });
    } else {
      this.snackBar.open('User location not available.', 'X', { duration: 5000 });
    }
  }


}
