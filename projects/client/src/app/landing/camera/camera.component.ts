import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;

  constructor(private snackBar: MatSnackBar) {}

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
