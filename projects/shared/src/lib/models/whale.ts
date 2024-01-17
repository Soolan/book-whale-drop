export interface Whale {
  name: string;
  description: string;
  source: Coordinate;
  destination: Coordinate;
  altitude: number;
  cruisingSpeed: number;
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
