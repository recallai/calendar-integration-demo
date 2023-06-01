import db from "../../db.js";

export default async (req, res) => {
  if (!req.authenticated) {
    return res.redirect("/");
  } else {
    const calendar = await db.Calendar.findByPk(req.params.id);
    if (calendar) {
      const [webhooks, events] = await Promise.all([
        calendar.getCalendarWebhooks({
          order: [["receivedAt", "DESC"]],
        }),
        calendar.getCalendarEvents(),
      ]);

      return res.render("calendar.ejs", {        
        calendar,
        webhooks,
        events: events.sort((a, b) => a.startTime - b.startTime),
        notice: req.notice,
        user: req.authentication.user,
      });
    } else {
      return res.render("404.ejs", {
        notice: req.notice,
      });
    }
  }
};
