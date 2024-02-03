import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {updateWhales} from "./whale";

admin.initializeApp();

const db = admin.firestore();

exports.whaleControlTower = onSchedule({
  schedule: "every 1 minutes",
  retryCount: 2,
  minBackoffSeconds: 60,
}, () =>  updateWhales(db));

