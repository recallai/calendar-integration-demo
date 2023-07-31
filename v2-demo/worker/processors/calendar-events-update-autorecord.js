import db from "../../db.js";
import { backgroundQueue } from "../../queue.js";
import { updateAutoRecordStatusForCalendarEvents } from "../../logic/autorecord.js";

export default async (job) => {
  const { calendarId, recallEventIds } = job.data;
  const [calendar, events] = await Promise.all([
    db.Calendar.findByPk(calendarId),
    db.CalendarEvent.findAll({
      where: {
        recallId: {
          [db.Sequelize.Op.in]: recallEventIds,
        },
      },
    }),
  ]);

  await updateAutoRecordStatusForCalendarEvents({ calendar, events });
  console.log(
    `INFO: Updated auto record status for ${events.length} events for calendar ${calendarId}`
  );

  // queue up bot schedule updates
  events.forEach((event) => {
    backgroundQueue.add("calendarevent.update_bot_schedule", {
      calendarId,
      recallEventId: event.recallId,
    });
  });
};
