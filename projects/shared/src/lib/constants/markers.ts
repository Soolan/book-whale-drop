import {IconOptions} from 'leaflet';

export const MARKER_ICON: IconOptions = {
  shadowUrl: 'assets/marker-shadow.png',
  iconSize:     [64, 64], // size of the icon
  shadowSize:   [20, 64], // size of the shadow
  iconAnchor:   [22, 64], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
}

export const START_MARKER_ICON: IconOptions = {iconUrl: 'assets/marker-start.png', ...MARKER_ICON};

export const STEP_MARKER_ICON: IconOptions = {iconUrl: 'assets/marker-step.png', ...MARKER_ICON};

export const END_MARKER_ICON: IconOptions = {iconUrl: 'assets/marker-end.png', ...MARKER_ICON};

export const WHALE_ICON: IconOptions = {
  iconSize:     [64, 64], // size of the icon
  iconAnchor:   [22, 64], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
}

export const FLYING_WHALE_ICON: IconOptions = {iconUrl: 'assets/whale-flying.png', ...WHALE_ICON};

export const RETIRED_WHALE_ICON: IconOptions = {iconUrl: 'assets/whale-retired.png', ...WHALE_ICON};
