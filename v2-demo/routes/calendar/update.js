import { generateNotice } from "../utils.js";
import db from "../../db.js";
import { backgroundQueue } from "../../queue.js";
import { updateAutoRecordStatusForCalendarEvents } from "../../logic/autorecord.js";

export default async (req, res) => {
  if (!req.authenticated) {
    return res.redirect("/");
  } else {
    const calendar = await db.Calendar.findByPk(req.params.id);
    if (calendar) {
      // html form payload does not include unchecked checkboxes, so we default to "off".
      const {
        autoRecordExternalEvents = "off",
        autoRecordOnlyConfirmedEvents = "off",
      } = req.body || {};

      calendar.autoRecordExternalEvents = autoRecordExternalEvents === "on" ? true : false;
      calendar.autoRecordOnlyConfirmedEvents = autoRecordOnlyConfirmedEvents === "on" ? true : false;
      await calendar.save();
      
      res.cookie(
        "notice",
        JSON.stringify(
          generateNotice(
            "success",
            `Calendar(ID: ${calendar.id}, email: ${calendar.email}) recording preferences updated successfully.`
          )
        )
      );

      const [webhooks, events] = await Promise.all([
        calendar.getCalendarWebhooks({
          order: [["receivedAt", "DESC"]],
        }),
        // todo: filter out events that have ended/ongoing
        calendar.getCalendarEvents(),
      ]);

      await updateAutoRecordStatusForCalendarEvents({ calendar, events });
      events.forEach((event) => {
        backgroundQueue.add("calendarevent.update_bot_schedule", {
          calendarId: calendar.id,
          recallEventId: event.recallId,
        });
      });

      return res.redirect(`/calendar/${calendar.id}`);
    } else {
      return res.render("404.ejs", {
        notice: req.notice,
      });
    }
  }
};
