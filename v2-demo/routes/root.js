import { generateNotice } from "./utils.js";
import {
  buildGoogleCalendarOAuthUrl,
  buildMicrosoftOutlookOAuthUrl,
} from "../logic/oauth.js";

export default async (req, res) => {
  if (req.authenticated) {
    const calendars = await req.authentication.user.getCalendars();    
    return res.render("index.ejs", {
      notice: req.notice,
      user: req.authentication.user,
      calendars,
      connectUrls: {
        googleCalendar: buildGoogleCalendarOAuthUrl({
          userId: req.authentication.user.id,
        }),
        microsoftOutlook: buildMicrosoftOutlookOAuthUrl({
          userId: req.authentication.user.id,
        }),
      },
    });
  } else {
    res.cookie(
      "notice",
      JSON.stringify(
        generateNotice("error", "You must be signed in to proceed.")
      )
    );
    return res.redirect("/sign-in");
  }
};
