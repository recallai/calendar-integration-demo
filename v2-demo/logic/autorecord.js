export async function updateAutoRecordStatusForCalendarEvents({
  calendar,
  events = [],
}) {
  if (!calendar || !events || events.length === 0) {
    return;
  }

  console.log(
    `INFO: Update auto record status for: ${calendar.id} for ${events.length} events, ${events[0].id}`
  );

  const {
    autoRecordExternalEvents,
    autoRecordOnlyConfirmedEvents,
    email: calendarEmail,
  } = calendar;

  for (const index in events) {
    const event = events[index];
    if (event.endTime < new Date()) {
      // ignore events that have ended/ongoing
      console.log(
        `INFO: Ignoring event ${event.title} as it has ended`
      );
      continue;
    }

    let shouldRecordAutomatic = false;
    if (autoRecordExternalEvents) {
      shouldRecordAutomatic = isExternalEvent({
        event,
        calendarEmail,
      });
    }

    if (autoRecordOnlyConfirmedEvents) {
      shouldRecordAutomatic =
        shouldRecordAutomatic &&
        isConfirmedEvent({
          event,
          calendarEmail,
        });
    }

    event.shouldRecordAutomatic = shouldRecordAutomatic;
    await event.save();
    console.log(
      `INFO: Updated should record automatic status of '${event.title}' to ${shouldRecordAutomatic}`
    );
  }
}

function isExternalEvent({ event, calendarEmail }) {
  return getAttendeesForCalendarEvent(event)
    .map((attendee) => attendee["email"])
    .reduce(
      (acc, attendeeEmail) =>
        acc ||
        attendeeEmail.split("@")[1].toLowerCase() !==
          calendarEmail.split("@")[1].toLowerCase(),
      false
    );
}

function isConfirmedEvent({ event, calendarEmail }) {
  return Boolean(
    getAttendeesForCalendarEvent(event).filter(
      (attendee) =>
        attendee["email"] === calendarEmail.toLowerCase() &&
        attendee["accepted"]
    )[0]
  );
}

function getAttendeesForCalendarEvent(event) {
  let attendees = [];
  if (event.platform === "google_calendar") {
    attendees = (event.recallData.raw["attendees"] || []).map((attendee) => ({
      email: attendee["email"].toLowerCase(),
      accepted: attendee["responseStatus"] === "accepted",
    }));
    attendees.push({
      email: event.recallData.raw["organizer"]["email"].toLowerCase(),
      accepted: true,
    });
  } else if (event.platform === "microsoft_outlook") {
    attendees = (event.recallData.raw["attendees"] || []).map((attendee) => ({
      email: attendee["emailAddress"]["address"].toLowerCase(),
      accepted:
        attendee["status"]["response"] === "accepted" ||
        attendee["status"]["response"] === "organizer",
    }));

    attendees.push({
      email:
        event.recallData.raw["organizer"]["emailAddress"][
          "address"
        ].toLowerCase(),
      accepted: true,
    });
  } else {
    throw new Error("PLATFORM_NOT_SUPPORTED");
  }

  return attendees;
}
