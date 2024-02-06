import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Whale} from '@shared-models/whale';
import {HelperService} from '../../services/helper.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  progress: number = 0; // Assuming progress is a property in your component
  private lastPosition: string = ''; // last calculated smooth position

  constructor(
    private snackBar: MatSnackBar,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: { userLocation: any; closestWhales: any }
  ) {}

  ngAfterViewInit(): void {
    this.initCamera();
    // Assuming data.closestWhales is an array of whales, and we're selecting the first one
    const currentWhale = this.data.closestWhales[0];

    if (currentWhale) {
      this.updateProgress(currentWhale);
    } else {
      console.error('No whale data available.');
    }
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

  updateProgress(whale: Whale): void {
    const intervalDuration = 1000; // Update every 5 seconds (adjust as needed)
    const nextPoint = whale.path[whale.completedSteps + 1];

    if (nextPoint) {
      const distance = this.helperService.haversine(whale.lastSeen, nextPoint);

      // Adjust the total duration based on the distance and whale's speed
      const totalDuration = (distance / whale.speed) * 3600;

      setInterval(() => {
        // Update the progress value based on elapsed time
        this.progress = (this.progress + (intervalDuration / 1000)) % totalDuration;
      }, intervalDuration);
    } else {
      console.error('No next point in the whale\'s path');
    }
  }

  calculateSmoothPosition(whale: Whale, progress: number): string {
    const start = this.lastPosition !== '' ?
      this.helperService.extractCoordinate(this.lastPosition) : whale.lastSeen;
    const end = whale.path[whale.completedSteps];
    const speed = whale.speed;
    const distance = this.helperService.haversine(start, end);

    // Adjust the total duration (in seconds) based on the distance and whale's speed
    const totalDuration = (distance / speed) * 3600;

    // Calculate the progress from 0 to 1 based on the elapsed time and total duration
    const elapsedTime = progress * totalDuration;

    // Calculate the actual progress within the total duration
    const actualProgress = elapsedTime / totalDuration;

    // Use linear interpolation to calculate the smooth position
    const position = this.helperService.interpolatePosition(start, end, actualProgress);
    this.lastPosition = position;
    return position;
  }


}
