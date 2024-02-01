// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


import * as admin from "firebase-admin";
import {onSchedule} from 'firebase-functions/lib/v2/providers/scheduler';
import {updateWhales} from './whale';

admin.initializeApp();
const db = admin.firestore();

exports.whaleControlTower = onSchedule({
  schedule: "every 5 minutes",
  retryCount: 2,
  minBackoffSeconds: 60,
}, _ => updateWhales(db));

