import { Injectable, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import {Coordinate} from '../models/whale';
import {
  END_MARKER_ICON,
  FLYING_WHALE_ICON,
  RETIRED_WHALE_ICON,
  START_MARKER_ICON,
  STEP_MARKER_ICON
} from '@shared-constants/markers';
import {IconOptions} from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map!: L.Map;

  initMap(mapContainer: ElementRef): void {
    const mapOptions: L.MapOptions = {
      center: [0, 0],
      zoom: 1,
      maxZoom: 18,  // Adjust the maxZoom as needed
      minZoom: 1,   // Adjust the minZoom as needed
    };

    this.map = L.map(mapContainer.nativeElement, mapOptions);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  addMarkers(path: Coordinate[]): void {
    // Clear previous markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    const start = 0;
    const end = path.length - 1;

    path.forEach((marker: Coordinate, index: number) => {
      const popup = index == start ? 'Start' : index == end ? 'End' : `Stop ${index}`;
      const iconOptions: IconOptions =
        index == start ? START_MARKER_ICON : index == end ? END_MARKER_ICON : STEP_MARKER_ICON;
      const icon = L.icon(iconOptions);
      L.marker([marker.latitude, marker.longitude], {icon: icon})
        .bindPopup(popup)
        .addTo(this.map);
    });

    const bounds = L.latLngBounds([
      [path[start].latitude, path[start].longitude],
      [path[end].latitude, path[end].longitude],
    ]);

    this.map.fitBounds(bounds);
  }

  addWhaleMarker(lastSeen: Coordinate, isActive: boolean): void {
    const icon = L.icon(isActive ? FLYING_WHALE_ICON : RETIRED_WHALE_ICON);
    L.marker([lastSeen.latitude, lastSeen.longitude], {icon: icon}).addTo(this.map);
  }
}
