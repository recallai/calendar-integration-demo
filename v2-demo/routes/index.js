import { Router } from "express";

import root from "./root.js";
import catchAll from "./catch-all.js";
import signInGet from "./sign-in/get.js";
import signInPost from "./sign-in/post.js";
import signUpGet from "./sign-up/get.js";
import signUpPost from "./sign-up/post.js";
import calendarGet from "./calendar/get.js";
import calendarDelete from "./calendar/delete.js";
import calendarUpdate from "./calendar/update.js";
import calendarEventSetManualRecord from "./calendar-event/set-manual-record.js";
import oauthCallbackGoogleCalendar from "./oauth-callback/google-calendar.js";
import oauthCallbackMicrosoftOutlook from "./oauth-callback/microsoft-outlook.js";
import webhooksRecallCalendarUpdates from "./webhooks/recall-calendar-updates.js";

const router = Router();

router.get("/", root);

router.get("/sign-in", signInGet);
router.post("/sign-in", signInPost);

router.get("/sign-up", signUpGet);
router.post("/sign-up", signUpPost);

router.get("/calendar/:id", calendarGet);
router.patch("/calendar/:id", calendarUpdate);
router.delete("/calendar/:id", calendarDelete);

router.patch("/calendar-event/:id/set-manual-record", calendarEventSetManualRecord);

router.get("/oauth-callback/google-calendar", oauthCallbackGoogleCalendar);
router.get("/oauth-callback/microsoft-outlook", oauthCallbackMicrosoftOutlook);

router.post("/webhooks/recall-calendar-updates", webhooksRecallCalendarUpdates);

router.get("*", catchAll);

export default router;
