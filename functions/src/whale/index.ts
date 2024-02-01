// Helper function to convert degrees to radians
import {Coordinate} from '@shared-models/whale';

export function updateWhales(db: any): void {
  // TODO
}


export function calculateNewLocation(current: Coordinate, target: Coordinate, speed: number): Coordinate {
  // Convert latitude and longitude from degrees to radians
  const currentLatRad = toRadians(current.latitude);
  const currentLngRad = toRadians(current.longitude);
  const targetLatRad = toRadians(target.latitude);
  const targetLngRad = toRadians(target.longitude);

  // Calculate the distance (in radians) between current and target locations
  const distance = haversine(current, target);

  // Calculate the time it takes to reach the target at the given speed (hours)
  const timeHours = distance / speed;

  // Interpolate between current and target locations based on time
  const newLatRad = currentLatRad + (targetLatRad - currentLatRad) * timeHours;
  const newLngRad = currentLngRad + (targetLngRad - currentLngRad) * timeHours;

  // Convert the new latitude and longitude back to degrees
  const newLatitude = toDegrees(newLatRad);
  const newLongitude = toDegrees(newLngRad);

  return { latitude: newLatitude, longitude: newLongitude };
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Helper function to convert radians to degrees
function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

// Helper function to calculate haversine distance between two points (in radians)
function haversine(lastSeen: Coordinate, target: Coordinate): number {
  const earthRadius = 6371; // Earth's radius in kilometers
  const latitude = toRadians(target.latitude - lastSeen.latitude);
  const longitude = toRadians(target.longitude - lastSeen.longitude);
  const a =
    Math.sin(latitude / 2) ** 2 +
    Math.cos(toRadians(lastSeen.latitude)) *
    Math.cos(toRadians(target.latitude)) *
    Math.sin(longitude / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}
