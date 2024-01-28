import { Component } from '@angular/core';
import {CameraComponent} from './camera/camera.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private dialog: MatDialog) {}

  camera(): void {

    const dialogRef = this.dialog.open(CameraComponent, {
      disableClose: true,
      panelClass: 'camera-dialog'
    });
  }
}
