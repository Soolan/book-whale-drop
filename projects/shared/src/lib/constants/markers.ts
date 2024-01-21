import { IconOptions } from 'leaflet';

const initMarkerIcon = (iconUrl: string): IconOptions => ({
  iconUrl,
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [34, 48],  // size of the icon
  iconAnchor: [16, 46], // icon position relative to marker's location
  shadowSize: [34, 20], // size of the shadow
  shadowAnchor: [4, 15], // shadow position relative to marker's location
  popupAnchor: [4, -48] // popup position relative to marker's location
});

export const START_MARKER_ICON: IconOptions = initMarkerIcon('assets/marker-start.png');
export const STEP_MARKER_ICON: IconOptions = initMarkerIcon('assets/marker-step.png');
export const END_MARKER_ICON: IconOptions = initMarkerIcon('assets/marker-end.png');

const initWhaleIcon = (iconUrl: string): IconOptions => ({
  iconUrl,
  iconSize: [64, 64],
  iconAnchor: [20, 64],
  popupAnchor: [-3, -16]
});

export const FLYING_EAST_WHALE_ICON: IconOptions = initWhaleIcon('assets/whale-flying-east.png');
export const RETIRED_EAST_WHALE_ICON: IconOptions = initWhaleIcon('assets/whale-retired-east.png');

export const FLYING_WEST_WHALE_ICON: IconOptions = initWhaleIcon('assets/whale-flying-west.png');
export const RETIRED_WEST_WHALE_ICON: IconOptions = initWhaleIcon('assets/whale-retired-west.png');
