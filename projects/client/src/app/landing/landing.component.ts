import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  camera(): void {
    const videoElement = document.createElement('video');

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Attach the video stream to the video element
        videoElement.srcObject = stream;
        document.body.appendChild(videoElement);

        // Play the video
        videoElement.play();
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }
}
