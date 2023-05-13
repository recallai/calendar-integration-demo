import Recall from "../../services/recall/index.js";
import db from "../../db.js";

export default async (job) => {
  const { calendarId } = job.data;
  const calendar = await db.Calendar.findByPk(calendarId);
  if (calendar) {
    const recallCalendar = await Recall.getCalendar(calendar.recallId);
    calendar.recallData = recallCalendar;
    await calendar.save();
  }
};
