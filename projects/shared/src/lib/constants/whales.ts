import {WhaleSize} from '../enums/whale-size';

export const NEW_WHALE = {
  name: 'Willy',
  size: WhaleSize.Large,
  description: 'Friendly nordic whale',
  altitude: 50,
  speed: 1,
  views: 0,
  path: [
    { longitude: 180, latitude: 0},
    { longitude: -180, latitude: 0}
  ],
  lastSeen: {longitude: 180,latitude: 0},
  timestamps: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deletedAt: 0
  }
}



