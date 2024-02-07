import {ElementRef, Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Location, Whale} from '../models/whale';
import {
  END_MARKER_ICON,
  FLYING_EAST_WHALE_ICON,
  FLYING_WEST_WHALE_ICON,
  RETIRED_EAST_WHALE_ICON,
  RETIRED_WEST_WHALE_ICON,
  START_MARKER_ICON,
  STEP_MARKER_ICON,
  USER_ICON,
} from '@shared-constants/markers';

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

  addPathMarkers(path: Location[]): void {
    // Clear previous markers and lines
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        layer.remove();
      }
    });
    const start = 0;
    const end = path.length - 1;
    path.forEach((marker: Location, index: number) => {
      const popup = index == start ?
        `Start:<br/>${marker.locationName}` : index == end ?
          `End:<br/>${marker.locationName}` : `Step ${index+1}:<br/>${marker.locationName}`;
      const iconOptions =
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

  setPolylines(path: Location[], completedSteps: number): void {
    // Split the path into completed and remaining steps
    const completedPath = path.slice(0, completedSteps + 1);
    const currentLeg = path.slice(completedSteps, completedSteps + 2);
    const remainingPath = path.slice(completedSteps + 1);
    const completedCoordinates = completedPath.map(c => L.latLng(c.latitude, c.longitude));
    const currentCoordinates = currentLeg.map(c => L.latLng(c.latitude, c.longitude));
    const remainingCoordinates = remainingPath.map(c => L.latLng(c.latitude, c.longitude));
    L.polyline(completedCoordinates, { color: '#3c5aa8', weight: 3, dashArray: '10, 7' }).addTo(this.map);
    L.polyline(currentCoordinates, { color: '#466dd3', weight: 4, dashArray: '10, 7' }).addTo(this.map);
    L.polyline(remainingCoordinates, { color: '#6f88ca', weight: 2, dashArray: '5, 5' }).addTo(this.map);
  }

  addWhaleMarker(whale: Whale, isActive: boolean): void {
    // Set the whale icon based on the status and direction
    const whaleIcon =  isActive ?
        this.isFacingEast(whale) ? FLYING_EAST_WHALE_ICON : FLYING_WEST_WHALE_ICON :
        this.isFacingEast(whale) ? RETIRED_EAST_WHALE_ICON : RETIRED_WEST_WHALE_ICON;

    // Add the whale marker to the map
    const whaleMarker =
      L.marker([whale.lastSeen.latitude, whale.lastSeen.longitude], {icon: L.icon(whaleIcon)})
      .addTo(this.map);

    // Click event listener for the marker
    whaleMarker.on('click', () => {
      // Change the map view to the desired location when the marker is clicked
      this.map.setView([whale.lastSeen.latitude, whale.lastSeen.longitude], 5);  // zoom level (7)
    });
  }

  addUserMarker(coordinate: Location): void {
    // Add the whale marker to the map
    const userMarker =
      L.marker([coordinate.latitude, coordinate.longitude], {icon: L.icon(USER_ICON)})
        .bindPopup(`You are here!<br/>${coordinate.locationName}`)
        .addTo(this.map);
  }

  // Calculate the direction based on coordinates
  isFacingEast(whale: Whale): boolean {
    return (whale.completedSteps + 1 < whale.path.length) ?
      whale.path[whale.completedSteps + 1].longitude > whale.path[whale.completedSteps].longitude:
      whale.path[whale.completedSteps].longitude > whale.path[whale.completedSteps - 1].longitude;
  }

  // Calculate the distance between user location and a line
  calculateDistanceToLine(userLocation: Location, lineStart: Location, lineEnd: Location): number {
    const A = userLocation.longitude - lineStart.longitude;
    const B = userLocation.latitude - lineStart.latitude;
    const C = lineEnd.longitude - lineStart.longitude;
    const D = lineEnd.latitude - lineStart.latitude;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = dot / lenSq;
    let closestX, closestY;

    if (param < 0 || (lineStart.longitude === lineEnd.longitude && lineStart.latitude === lineEnd.latitude)) {
      closestX = lineStart.longitude;
      closestY = lineStart.latitude;
    } else if (param > 1) {
      closestX = lineEnd.longitude;
      closestY = lineEnd.latitude;
    } else {
      closestX = lineStart.longitude + param * C;
      closestY = lineStart.latitude + param * D;
    }
    return Math.sqrt((userLocation.longitude - closestX) ** 2 + (userLocation.latitude - closestY) ** 2);
  }

  isMapInitialized(id?: string): boolean {
    if (!id) {
      return !!this.map;
    } else {
      return !!this.map && document.getElementById(id) !== null;
    }
  }
}
