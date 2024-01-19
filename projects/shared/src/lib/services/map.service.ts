import { Injectable, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import {Coordinate} from '../models/whale';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;

  initMap(mapContainer: ElementRef): void {
    const mapOptions: L.MapOptions = {center: [0, 0], zoom: 2};

    this.map = L.map(mapContainer.nativeElement, mapOptions);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  addMarkers(coordinates: { source: Coordinate, destination: Coordinate }): void {
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        layer.remove();  // Clear previous markers
      }
    });

    const sourceMarker = L.marker([coordinates.source.latitude, coordinates.source.longitude])
      .bindPopup('Source')
      .addTo(this.map);

    const destinationMarker = L.marker([coordinates.destination.latitude, coordinates.destination.longitude])
      .bindPopup('Destination')
      .addTo(this.map);

    const bounds = L.latLngBounds([
      [coordinates.source.latitude, coordinates.source.longitude],
      [coordinates.destination.latitude, coordinates.destination.longitude],
    ]);

    this.map.fitBounds(bounds);
  }
}
