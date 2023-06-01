import Recall from "../../services/recall/index.js";
import db from "../../db.js";

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
      const [instance, created] = await db.CalendarEvent.upsert({
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
};


