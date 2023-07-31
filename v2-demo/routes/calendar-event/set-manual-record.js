import { generateNotice } from "../utils.js";
import db from "../../db.js";
import { backgroundQueue } from "../../queue.js";
import { updateAutoRecordStatusForCalendarEvents } from "../../logic/autorecord.js";

export default async (req, res) => {
  if (!req.authenticated) {
    return res.redirect("/");
  } else {
    const event = await db.CalendarEvent.findByPk(req.params.id);
    if (event) {
      const { manualRecord = null } = req.body || {};
      console.log(
        `INFO: Will set manual record to ${manualRecord} for event(ID: ${event.id}).`
      );
      
      event.shouldRecordManual = manualRecord;
      await event.save();

      res.cookie(
        "notice",
        JSON.stringify(
          generateNotice(
            "success",
            `Calendar Event(ID: ${event.id}) manual record set successfully.`
          )
        )
      );

      const calendar = await event.getCalendar();
      await updateAutoRecordStatusForCalendarEvents({
        calendar,
        events: [event],
      });
      backgroundQueue.add("calendarevent.update_bot_schedule", {
        calendarId: calendar.id,
        recallEventId: event.recallId,
      });

      return res.redirect(`/calendar/${calendar.id}`);
    } else {
      return res.render("404.ejs", {
        notice: req.notice,
      });
    }
  }
};
