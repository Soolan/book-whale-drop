import {WhaleSize} from '../enums/whale-size';

export interface Whale {
  name: string;
  size: WhaleSize;
  description: string;
  altitude: number;
  speed: number;
  views: number;
  path: Coordinate[];
  lastSeen: Coordinate;
  timestamps: Timestamps;
}

export interface Coordinate {
  longitude: number;
  latitude: number;
}

export interface Timestamps {
  createdAt: number;  // when whale spawned for the first time
  updatedAt: number;  // during coordination updates
  deletedAt: number;  // when whale reaches the destination
}
