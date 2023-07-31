import db from "../../db.js";

export default async (job) => {
  const { calendarId, event, payload } = job.data;
  const calendarWebhook = await db.CalendarWebhook.create({
    calendarId,
    event,
    payload,
    receivedAt: new Date(),
  });
  console.log(
    `INFO: Recorded calendar webhook: ${JSON.stringify(calendarWebhook)}`
  );
};
