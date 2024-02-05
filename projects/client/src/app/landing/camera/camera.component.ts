import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

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
}
