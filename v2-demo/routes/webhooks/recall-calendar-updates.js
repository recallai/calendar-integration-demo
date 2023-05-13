import { backgroundQueue } from "../../queue.js";
import db from "../../db.js";

export default async (req, res) => {
  const { event, data: payload } = req.body;
  const { calendar_id: recallId } = payload;
  console.log(
    `INFO: Received "${event}" calendar webhook from Recall with data ${JSON.stringify(
      payload
    )}`
  );

  // verify calendar exists on our end
  const calendar = await db.Calendar.findOne({ where: { recallId } });
  if (!calendar) {
    console.log(
      `INFO: Could not find calendar with recall_id: ${recallId}. Ignoring webhook.`
    );
    return res.sendStatus(200);
  }

  // queue job to save the webhook for bookkeeping
  backgroundQueue.add("calendarwebhooks.save", {
    calendarId: calendar.id,
    event,
    payload,
  });

  // queue jobs to process the webhook
  if (event === "calendar.update") {
    backgroundQueue.add("recall.calendar.update", {
      calendarId: calendar.id,
      recallId: calendar.recallId,
    });
  } else if (event === "calendar.sync_events") {
    backgroundQueue.add("recall.calendar.sync_events", {
      calendarId: calendar.id,
      recallId: calendar.recallId,
      lastUpdatedTimestamp: payload.last_updated_ts,
    });
  }

  return res.sendStatus(200);
};
