import {Coordinate, WhaleWithId} from "@shared-models/whale";
import {logger} from "firebase-functions";
import {firestore} from "firebase-admin";

export async function updateWhales(db: firestore.Firestore): Promise<void> {
  try {
    const activeWhales: WhaleWithId[] = await getActiveWhales(db);
    // Check if there is an issue fetching whales or if the array is empty
    if (!activeWhales || activeWhales.length === 0) {
      logger.warn("No active whales found. Exiting update process.");
      return;
    }
    // Use Promise.all to process whales concurrently
    await Promise.all(activeWhales.map((whale: WhaleWithId) => processWhale(whale, db)));

    logger.info(`Whales updates finished. Total whales processed: ${activeWhales.length}`);
  } catch (error) {
    // Log any errors that occurred during the update process
    logger.error(`Error updating whales: ${error}`);
  }
}


// Function to get active whales
async function getActiveWhales(db: any): Promise<WhaleWithId[]> {
  const querySnapshot = await db.collection("whales").where("timestamps.deletedAt", "==", 0).get();
  return querySnapshot.docs.map((doc: any) => ({id: doc.id, ...doc.data()} as WhaleWithId));
}


async function processWhale(whale: WhaleWithId, db: firestore.Firestore): Promise<void> {
  try {
    const earthRadius = 6371; // Radius of the Earth
    const nextStep = whale.path[whale.completedSteps + 1];
    const distanceToNextStep = haversine(whale.lastSeen, nextStep) * earthRadius;
    if (distanceToNextStep <= whale.speed) {
      // The whale will pass the next step with its current speed
      const remainingDistance = whale.speed - distanceToNextStep;
      // Move the whale in a straight line to the next step using the remaining distance
      whale.lastSeen = calculateNewLocation(nextStep, whale.path[whale.completedSteps + 2], remainingDistance);
      whale.completedSteps++;
    } else {
      whale.lastSeen = calculateNewLocation(whale.lastSeen, nextStep, whale.speed);
    }
    whale.timestamps.updatedAt = Date.now();
    whale.timestamps.deletedAt = whale.completedSteps === whale.path.length - 1 ? Date.now() : 0;
    await db.collection("whales").doc(whale.id).set(whale);
    logger.log(`Whale update completed for ${whale.id}`);
  } catch (error) {
    // Log any errors that occurred during the update process for a specific whale
    logger.error(`Error updating whale ${whale.id}: ${error}`);
    // Rethrow the error to propagate it up
    throw error;
  }
}

function hasPassedStep(lastSeen: Coordinate, nextStep: Coordinate): boolean {
  // Is the distance between lastSeen and nextStep below a certain threshold?
  const distance = haversine(lastSeen, nextStep);
  const threshold = 0.0000078; // 50 meters
  return distance < threshold;
}

function calculateNewLocation(current: Coordinate, target: Coordinate, speed: number): Coordinate {
  logger.log(`[currentlat] ${current.latitude} - [currentLng] ${current.longitude}`);
  logger.log(`[targetlat] ${target.latitude} - [targetLng] ${target.longitude}`);

  // Convert latitude and longitude from degrees to radians
  const currentLatRad = toRadians(current.latitude);
  const currentLngRad = toRadians(current.longitude);
  logger.log(`[currentLatRad] ${currentLatRad} - [currentLngRad] ${currentLngRad}`);

  const targetLatRad = toRadians(target.latitude);
  const targetLngRad = toRadians(target.longitude);
  logger.log(`[targetLatRad]  ${targetLatRad} - [targetLngRad] ${targetLngRad}`);

  // Calculate the distance (in radians) between current and target locations
  const distance = haversine(current, target);
  
  // Calculate the time it takes to reach the target at the given speed (hours)
  const timeHours = distance * (1 / speed);

  logger.log(`[distance] ${distance} - [timeHours] ${timeHours}`);

  // Interpolate between current and target locations based on time
  const newLatRad = currentLatRad + (targetLatRad - currentLatRad) * timeHours;
  const newLngRad = currentLngRad + (targetLngRad - currentLngRad) * timeHours;

  logger.log(`[New Rads]  latitude: ${newLatRad}, longitude: ${newLngRad}`);

  // Convert the new latitude and longitude back to degrees
  const newLatitude = toDegrees(newLatRad);
  const newLongitude = toDegrees(newLngRad);
  logger.log(`[New LatLng]  latitude: ${newLatitude}, longitude: ${newLongitude}`);


  // Limit the number of decimal places to 6
  const limitedLatitude = parseFloat(newLatitude.toFixed(6));
  const limitedLongitude = parseFloat(newLongitude.toFixed(6));
  logger.log(`[New Limited]  latitude: ${limitedLatitude}, longitude: ${limitedLongitude}`);


  return {latitude: limitedLatitude, longitude: limitedLongitude, locationName: ""};
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
  const latitude = toRadians(target.latitude - lastSeen.latitude);
  const longitude = toRadians(target.longitude - lastSeen.longitude);
  const a =
    Math.sin(latitude / 2) ** 2 +
    Math.cos(toRadians(lastSeen.latitude)) *
    Math.cos(toRadians(target.latitude)) *
    Math.sin(longitude / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
