import { Injectable, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import {Coordinate} from '../models/whale';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;

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
    const greenIcon = L.icon({
      iconUrl: 'assets/whale-flying.png',
      iconSize:     [64, 64], // size of the icon
      shadowSize:   [20, 64], // size of the shadow
      iconAnchor:   [22, 64], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    path.forEach((stop: Coordinate, index: number) => {
      const label = index == start ? 'Start' : index == end ? 'End' : `Stop ${index}`;
      L.marker([stop.latitude, stop.longitude], {icon: greenIcon}).bindPopup(label).addTo(this.map);
    });

    const bounds = L.latLngBounds([
      [path[start].latitude, path[start].longitude],
      [path[end].latitude, path[end].longitude],
    ]);

    this.map.fitBounds(bounds);
  }
}
