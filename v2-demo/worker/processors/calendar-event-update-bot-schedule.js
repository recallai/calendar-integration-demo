import Recall from "../../services/recall/index.js";
import db from "../../db.js";

// add or remove bot for a calendar event based on its record status
export default async (job) => {
  const { recallEventId } = job.data;
  const event = await db.CalendarEvent.findOne({
    where: { recallId: recallEventId },
  });

  let updatedEventFromRecall = null;
  if (
    (event.shouldRecordAutomatic || event.shouldRecordManual) &&
    event.meetingUrl
  ) {
    console.log(`INFO: Schedule bot for event ${event.id}`);
    // add a bot to record the event. Recall will handle the case where the bot already exists.
    updatedEventFromRecall = await Recall.addBotToCalendarEvent({
      id: event.recallId,
      deduplicationKey: `${event.startTime.toISOString()}-${event.meetingUrl}`,
      botConfig: {},
    });
  } else {
    console.log(`INFO: Delete bot for event ${event.id}`);
    // delete the bot for the event. Recall will handle the case where the bot does not exist.
    updatedEventFromRecall = await Recall.removeBotFromCalendarEvent({
      id: event.recallId,
    });
  }

  // update event data returned from Recall
  if (updatedEventFromRecall) {
    event.recallData = updatedEventFromRecall;
    await event.save();
  }
};
