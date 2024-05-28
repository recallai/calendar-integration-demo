export function buildGoogleCalendarOAuthUrl(state) {
  const params = {
    client_id: process.env.GOOGLE_CALENDAR_OAUTH_CLIENT_ID,
    redirect_uri: process.env.PUBLIC_URL + "/oauth-callback/google-calendar",
    response_type: "code",
    scope: buildGoogleOAuthScopes().join(" "),
    access_type: "offline",
    prompt: "consent",
    state: JSON.stringify(state),
  };

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams(params).toString();

  return url.toString();
}

function buildGoogleOAuthScopes() {
  return process.env.REQUEST_ONLY_CALENDAR_SCOPES ? ["https://www.googleapis.com/auth/calendar.events.readonly"] : ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar.events.readonly"];
}

export function buildMicrosoftOutlookOAuthUrl(state) {
  const params = {
    client_id: process.env.MICROSOFT_OUTLOOK_OAUTH_CLIENT_ID,
    redirect_uri: process.env.PUBLIC_URL + "/oauth-callback/microsoft-outlook",
    response_type: "code",
    scope: buildMicrosoftOutlookOAuthScopes().join(" "),
    // prompt: "consent",
    state: JSON.stringify(state),
  };

  const url = new URL(
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
  );
  url.search = new URLSearchParams(params).toString();

  return url.toString();
}

function buildMicrosoftOutlookOAuthScopes() {
  const baseCalendarScopes = ["offline_access", "https://graph.microsoft.com/Calendars.Read"]
  return process.env.REQUEST_ONLY_CALENDAR_SCOPES ? baseCalendarScopes : [...baseCalendarScopes, "openid", "email"];
}

export async function fetchTokensFromAuthorizationCodeForGoogleCalendar(code) {
  const params = {
    client_id: process.env.GOOGLE_CALENDAR_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_CALENDAR_OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.PUBLIC_URL + "/oauth-callback/google-calendar",
    grant_type: "authorization_code",
    code,
  };

  const url = new URL("https://oauth2.googleapis.com/token");
  const response = await fetch(url.toString(), {
    method: "POST",
    body: new URLSearchParams(params),
  });

  return await response.json();
}

export async function fetchTokensFromAuthorizationCodeForMicrosoftOutlook(
  code
) {
  const params = {
    client_id: process.env.MICROSOFT_OUTLOOK_OAUTH_CLIENT_ID,
    client_secret: process.env.MICROSOFT_OUTLOOK_OAUTH_CLIENT_SECRET,
    redirect_uri:
      process.env.PUBLIC_URL + "/oauth-callback/microsoft-outlook",
    grant_type: "authorization_code",
    code,
  };
  const url = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/token");
  const response = await fetch(url.toString(), {
    method: "POST",
    body: new URLSearchParams(params),
  });
  return await response.json();
}
