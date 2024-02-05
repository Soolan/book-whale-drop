import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Whale} from '@shared-models/whale';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { userLocation: any; closestWhales: any }
  ) {}

  ngAfterViewInit(): void {
    this.initCamera();
  }

  initCamera(): void {
    const video = this.videoElement.nativeElement;
    navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}  // This opens the back camera
    })
      .then((stream) => {
        video.srcObject = stream; // Attach the video stream to the video element
        video.play(); // Activate the camera
      })
      .catch((error) => this.snackBar.open(error.message, 'X', {duration: 5000}));
  }

  calculateSmoothPosition(whale: Whale): string {
    // Implement smooth interpolation logic based on real-time updates
    // You can use linear interpolation (lerp) or other techniques here
    // For simplicity, we'll just return the last known position as a string
    return `${whale.lastSeen.latitude} ${whale.lastSeen.longitude} 0`;
  }
}
