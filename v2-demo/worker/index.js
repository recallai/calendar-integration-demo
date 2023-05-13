import dotenv from "dotenv";
import consoleStamp from "console-stamp";
import { prepareDb } from "../db.js";
import { backgroundQueue } from "../queue.js";
import Recall from "../services/recall/index.js";

import calendarWebhooksSave from "./processors/calendar-webhooks-save.js";
import recallCalendarUpdate from "./processors/recall-calendar-update.js";
import recallCalendarSyncEvents from "./processors/recall-calendar-sync-events.js";

dotenv.config();
consoleStamp(console);

// setup db & recall service
await prepareDb();
Recall.initialize();

backgroundQueue.process("calendarwebhooks.save", 2, calendarWebhooksSave);
backgroundQueue.process("recall.calendar.update", 2, recallCalendarUpdate);
backgroundQueue.process(
  "recall.calendar.sync_events",
  2,
  recallCalendarSyncEvents
);

backgroundQueue.on("active", async (job) => {
  console.log(`INFO: Started job ${job.id}`);
});
backgroundQueue.on("completed", async (job) => {
  console.log(`INFO: Completed job ${job.id}`);
});
backgroundQueue.on("failed", async (job, err) => {
  console.log(`INFO: Failed job ${job.id} due to ${err}`);
});
backgroundQueue.on("stalled", async (job) => {
  console.log(`INFO: Stalled job ${job.id}`);
});

process.on("SIGINT", async () => {
  await backgroundQueue.close();
});
