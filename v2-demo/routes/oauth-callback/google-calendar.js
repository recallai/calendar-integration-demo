import { fetchTokensFromAuthorizationCodeForGoogleCalendar } from "../../logic/oauth.js";
import { generateNotice } from "../utils.js";
import db from "../../db.js";
import Recall from "../../services/recall/index.js";

export default async (req, res) => {
  if (
    req.headers.host.indexOf("localhost") === -1 &&
    process.env.NODE_ENV === "development"
  ) {
    const url = new URL(
      `http://localhost:${process.env.PORT}/oauth-callback/google-calendar`
    );
    url.search = new URLSearchParams(req.query).toString();
    // this ensures we redirect back to localhost and not tunneled public URL
    // before processing the oauth callback, which ensures cookies(authToken, notice)
    // are set correctly in development
    return res.redirect(url.toString());
  }

  try {
    const { userId, calendarId } = JSON.parse(req.query.state);
    console.log(
      `Received google oauth callback for user ${userId} with code ${req.query.code}`
    );

    const oauthTokens = await fetchTokensFromAuthorizationCodeForGoogleCalendar(
      req.query.code
    );
    if (oauthTokens.error) {
      res.cookie(
        "notice",
        JSON.stringify(
          generateNotice(
            "error",
            `Failed to exchanged code for oauth tokens due to "${oauthTokens.error}(${oauthTokens.error_description})"`
          )
        )
      );
      return res.redirect("/");
    }

    console.log(
      `Successfully exchanged code for oauth tokens: ${JSON.stringify(
        oauthTokens
      )}`
    );

    let localCalendar = null;
    let recallCalendar = null;
    if (calendarId) {
      localCalendar = await db.Calendar.findByPk(calendarId);
    }

    if (localCalendar) {
      // this calendar was re-connected so we need to update the oauth tokens in Recall
      // and update the calendar in our database
      recallCalendar = await Recall.updateCalendar({
        id: localCalendar.recallId,
        data: {          
          oauth_refresh_token: oauthTokens.refresh_token,
          oauth_client_id: process.env.GOOGLE_CALENDAR_OAUTH_CLIENT_ID,
          oauth_client_secret: process.env.GOOGLE_CALENDAR_OAUTH_CLIENT_SECRET,
          webhook_url: `${process.env.PUBLIC_URL}/webhooks/recall-calendar-updates`,
        },
      });
      console.log(
        `Successfully updated calendar in Recall: ${JSON.stringify(
          recallCalendar
        )}`
      );
      localCalendar.recallData = recallCalendar;
      await localCalendar.save();
      console.log(
        `Successfully updated calendar(id: ${localCalendar.id}) in database`
      );
    } else {
      // this calendar was connected for the first time so we need to create it in Recall
      // and then create it in our database
      recallCalendar = await Recall.createCalendar({
        platform: "google_calendar",
        webhook_url: `${process.env.PUBLIC_URL}/webhooks/recall-calendar-updates`,
        oauth_refresh_token: oauthTokens.refresh_token,
        oauth_client_id: process.env.GOOGLE_CALENDAR_OAUTH_CLIENT_ID,
        oauth_client_secret: process.env.GOOGLE_CALENDAR_OAUTH_CLIENT_SECRET,
      });
      console.log(
        `Successfully created calendar in Recall: ${JSON.stringify(
          recallCalendar
        )}`
      );

      localCalendar = await db.Calendar.create({
        platform: "google_calendar",
        recallId: recallCalendar.id,
        recallData: recallCalendar,
        userId,
      });
      console.log(
        `Successfully created calendar in database with id: ${localCalendar.id}`
      );
    }

    res.cookie(
      "notice",
      JSON.stringify(
        generateNotice(
          "success",
          `Successfully connected google calendar for ${localCalendar.email}`
        )
      )
    );

    return res.redirect("/");
  } catch (err) {
    console.log(
      `INFO: Failed to handle oauth callback from Google Calendar due to ${err}`
    );
    return res.sendStatus(500);
  }
};
