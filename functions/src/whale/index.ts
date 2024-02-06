import {Coordinate, WhaleWithId} from "@shared-models/whale";
import {logger} from "firebase-functions";
import {firestore} from "firebase-admin";

const EARTH_RADIUS = 6371; // Radius of the Earth in Km

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

    // logger.info(`Whales updates finished. Total whales processed: ${activeWhales.length}`);
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
    const nextStep = whale.path[whale.completedSteps + 1];
    const distanceToNextStep = haversine(whale.lastSeen, nextStep) * EARTH_RADIUS;
    if (distanceToNextStep > whale.speed) {
      whale.lastSeen = calculateNewLocation(whale.lastSeen, nextStep, whale.speed);
    } else {
      // The whale will pass the next step in the path with the current speed
      const remainingDistance = whale.speed - distanceToNextStep;
      // Move the whale in a straight line to the following step using the remaining distance
      whale.lastSeen = calculateNewLocation(nextStep, whale.path[whale.completedSteps + 2], remainingDistance);
      whale.completedSteps++;
    }
    whale.timestamps.updatedAt = Date.now();
    if (whale.completedSteps === whale.path.length - 1) {
      whale.timestamps.deletedAt = Date.now();
    } else {
      whale.lastSeen =
        projectPointToLine(whale.lastSeen, whale.path[whale.completedSteps], whale.path[whale.completedSteps + 1]);
    }
    logger.debug(`Projected: ${whale.lastSeen.latitude}, ${whale.lastSeen.longitude}`);
    const {id, ...whaleWithoutId} = whale;
    await db.collection("whales").doc(id).set(whaleWithoutId);
  } catch (error) {
    // Log any errors that occurred during the update process for a specific whale
    logger.error(`Error updating whale ${whale.id}: ${error}`);
    // Rethrow the error to propagate it up
    throw error;
  }
}

function calculateNewLocation(current: Coordinate, nextStep: Coordinate, speed: number): Coordinate {
  logger.debug(`Current location: ${current.latitude}, ${current.longitude}, next step: ${nextStep.latitude}, ${nextStep.longitude}, speed: ${speed}`);
  const distance = speed / 12; // Distance travelled in 5 minutes or 1/12 hour (scheduler runs every 5 min)
  const distanceRad = distance / EARTH_RADIUS;
  logger.debug(`Distance: ${distance}, distanceRad: ${distanceRad}`);
  const currentLatRad = toRadians(current.latitude);
  const currentLngRad = toRadians(current.longitude);
  logger.debug(`currentLatRad: ${currentLatRad}, currentLngRad: ${currentLngRad}`);
  
  const bearingRad = calculateBearing(current, nextStep);
  logger.debug(`bearingRad: ${bearingRad}`);

  // Calculate new latitude in radians
  const newLatRad = Math.asin(Math.sin(currentLatRad) * Math.cos(distanceRad) +
    Math.cos(currentLatRad) * Math.sin(distanceRad) * Math.cos(bearingRad));

  // Calculate new longitude in radians
  const newLngRad = currentLngRad + Math.atan2(
    Math.sin(bearingRad) * Math.sin(distanceRad) * Math.cos(currentLatRad),
    Math.cos(distanceRad) - Math.sin(currentLatRad) * Math.sin(newLatRad)
  );
  logger.debug(`newLatRad: ${newLatRad}, newLngRad: ${newLngRad}`);

  // Convert the new latitude and longitude back to degrees and round to 6 decimal places
  const newLatitude = parseFloat(toDegrees(newLatRad).toFixed(6));
  const newLongitude = parseFloat(toDegrees(newLngRad).toFixed(6));
  logger.debug(`New location: ${newLatitude}, ${newLongitude}`);
  return {latitude: newLatitude, longitude: newLongitude, locationName: ""};
}

function calculateBearing(start: Coordinate, end: Coordinate): number {
  const startLatRad = toRadians(start.latitude);
  const startLngRad = toRadians(start.longitude);
  const endLatRad = toRadians(end.latitude);
  const endLngRad = toRadians(end.longitude);
  const dLng = endLngRad - startLngRad;
  const x = Math.sin(dLng) * Math.cos(endLatRad);
  const y = Math.cos(startLatRad) * Math.sin(endLatRad) -
    Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(dLng);

  const bearingRad = Math.atan2(x, y);
  return (bearingRad < 0) ? (bearingRad + 2 * Math.PI) : bearingRad; //normalize to 0 - 2*PI
}


function projectPointToLine(point: Coordinate, lineStart: Coordinate, lineEnd: Coordinate): Coordinate {
  const distanceLineStartToPoint = haversine(lineStart, point);
  const distanceLineStartToEnd = haversine(lineStart, lineEnd);

  const t = distanceLineStartToPoint/distanceLineStartToEnd;
  if (t < 0) { // Point is beyond lineStart
    return lineStart;
  } else if (t > 1) { // Point is beyond lineEnd
    return lineEnd;
  } else { // Projected point is between lineStart and lineEnd
    const latDelta = lineEnd.latitude - lineStart.latitude;
    const lonDelta = lineEnd.longitude - lineStart.longitude;
    return {
      latitude: parseFloat((lineStart.latitude + t * latDelta).toFixed(6)),
      longitude: parseFloat((lineStart.longitude + t * lonDelta).toFixed(6)),
      locationName: "",
    };
  }
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
