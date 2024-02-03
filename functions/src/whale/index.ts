import {Coordinate, WhaleWithId} from "@shared-models/whale";
// import {Coordinate, WhaleWithId} from '../../../projects/shared/src/lib/models/whale';
import PromisePool from "es6-promise-pool";
import {logger} from "firebase-functions";
import {firestore} from "firebase-admin";

// Maximum concurrent whale updates.
const MAX_CONCURRENT = 5;
const THRESHOLD = 0.05; // 50 meters

export async function updateWhales(db: firestore.Firestore): Promise<void> {
  const activeWhales: WhaleWithId[] = await getActiveWhales(db);
  const promisePool = new PromisePool(
    () => processWhales(activeWhales, db),
    MAX_CONCURRENT,
  );
  await promisePool.start();
  logger.info(`Whales updates finished. Total whales processed: ${activeWhales.length}`);
}

// Function to get active whales
async function getActiveWhales(db: any): Promise<WhaleWithId[]> {
  const querySnapshot = await db.collection("whales").where("timestamps.deletedAt", "==", 0).get();
  return querySnapshot.docs.map((doc: any) => ({id: doc.id, ...doc.data()} as WhaleWithId));
}

async function processWhales(whales: WhaleWithId[], db: firestore.Firestore): Promise<void> {
  try {
    for (const whale of whales) {
      whale.lastSeen = calculateNewLocation(whale.lastSeen, whale.path[whale.completedSteps], whale.speed);
      whale.timestamps.updatedAt = Date.now();
      whale.completedSteps += hasPassedStep(whale.lastSeen, whale.path[whale.completedSteps]) ? 1 : 0;
      whale.timestamps.deletedAt = whale.completedSteps === whale.path.length - 1 ? Date.now() : 0;
      await db.collection("whales").doc(whale.id).set(whale);
      logger.log(`Whale update completed for ${whale.id}`);
    }
  } catch (error) {
    // Log any errors that occurred during the update process
    logger.error(`Error updating whales: ${error}`);
    throw error; // Rethrow the error to propagate it up
  }
}

function hasPassedStep(lastSeen: Coordinate, nextStep: Coordinate): boolean {
  // Is the distance between lastSeen and nextStep below a certain threshold?
  const distance = haversine(lastSeen, nextStep);
  return distance < THRESHOLD;
}

function calculateNewLocation(current: Coordinate, target: Coordinate, speed: number): Coordinate {
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

  return {latitude: newLatitude, longitude: newLongitude};
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
