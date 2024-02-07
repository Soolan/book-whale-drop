import {WhaleSize} from '../enums/whale-size';
import {Whale} from '@shared-models/whale';

export const NEW_WHALE: Whale = {
  name: 'Willy',
  size: WhaleSize.Huge,
  description: 'Friendly nordic whale',
  altitude: 50,
  speed: 60,
  views: 0,
  path: [
    { latitude: -36.8485, longitude: 174.7633 , locationName: "Auckland, New Zealand" },
    { latitude: -8.6705, longitude: 115.2126 , locationName: "Bali, Indonesia" },
    { latitude: 11.5564, longitude: 104.9282 , locationName: "Phnom Penh, Cambodia" },
    { latitude: 35.6895, longitude: 51.3890 , locationName: "Tehran, Iran" },
    { latitude: -33.9018, longitude: 17.9966 , locationName: "Capetown, South Africa" },
    { latitude: -22.9068, longitude: -43.1729 , locationName: "Rio de Janeiro, Brazil" },
    { latitude: 19.4326, longitude: -99.1332 , locationName: "Mexico City, Mexico" },
    { latitude: 58.3019, longitude: -134.4197 , locationName: "Juneau, USA" },
  ],
  lastSeen: { latitude: -36.8485, longitude: 174.7633 , locationName: "Auckland, New Zealand" },
  completedSteps: 0,
  timestamps: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deletedAt: 0
  }
}


export const WHALE_SIZES: any[] = [
  {
    name: 'Small',
    description: '10 meters (i.e Minke Whale: fit in shopping malls)'
  },
  {
    name: 'Medium',
    description: '15 meters (i.e Humpback Whale)'
  },
  {
    name: 'Large',
    description: '20 meters (i.e Sperm Whale)'
  },
  {
    name: 'Huge',
    description: '30 meters (i.e Blue Whale)'
  },
  {
    name: 'Gigantic',
    description: '100 meters (i.e Meta Whale)'
  },
  {
    name: 'Colossal',
    description: '500 meters (i.e WTF Whale)'
  }
];



