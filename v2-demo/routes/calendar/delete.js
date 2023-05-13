import { generateNotice } from "../utils.js";
import db from "../../db.js";
import Recall from '../../services/recall/index.js'

export default async (req, res) => {
  if (!req.authenticated) {
    return res.redirect("/");
  } else {
    const calendar = await db.Calendar.findByPk(req.params.id);
    if (calendar) {
      await Recall.deleteCalendar(calendar.recallId);
      const calendarId = calendar.id;
      const calendarEmail = calendar.email;
      await calendar.destroy();

      res.cookie(
        "notice",
        JSON.stringify(
          generateNotice(
            "success",
            `Calendar(ID: ${calendarId}, email: ${calendarEmail}) deleted successfully.`
          )
        )
      );
      return res.redirect("/");
    } else {
      return res.render("404.ejs", {
        notice: req.notice,
      });
    }
  }
};
