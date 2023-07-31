import Recall from "../../services/recall/index.js";
import db from "../../db.js";
import { backgroundQueue } from "../../queue.js";

export default async (job) => {
  const { calendarId, recallId, lastUpdatedTimestamp } = job.data;
  console.log(
    `INFO: Sync events for calendar ${calendarId}(recall_id: ${recallId}) since ${lastUpdatedTimestamp}`
  );
  const events = await Recall.fetchCalendarEvents({
    id: recallId,
    lastUpdatedTimestamp,
  });

  let eventsUpserted = [];
  let eventsDeleted = [];
  for (const event of events) {
    if (event["is_deleted"]) {
      await db.CalendarEvent.destroy({
        where: {
          recallId: event.id,
          calendarId: calendarId,
        },
      });
      eventsDeleted.push(event);
    } else {
      const [instance, _created] = await db.CalendarEvent.upsert({
        recallId: event.id,
        recallData: event,
        platform: event.platform,
        updatedAt: new Date(),
        calendarId: calendarId,
      });
      eventsUpserted.push(event);
    }
  }

  console.log(
    `INFO: Synced (upsert: ${eventsUpserted.length}, delete: ${eventsDeleted.length}) calendar events for calendar(${calendarId})`
  );

  // update auto record status of the latest synced events
  backgroundQueue.add("calendarevents.update_autorecord", {
    calendarId,
    recallEventIds: eventsUpserted.map((event) => event.id),
  });

  // delete bots for deleted events
  for (const event of eventsDeleted) {
    backgroundQueue.add("calendarevent.delete_bot", {
      recallEventId: event.id,
    });
  }
};
