export enum CalendarPlatform {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
}

export enum MeetingPlatform {
  ZOOM = "zoom",
  TEAMS = "microsoft_teams",
  MEET = "google_meet"
}

export type CalendarConnection = {
  platform: CalendarPlatform;
  connected: boolean;
  email: string | null;
};

export type Preferences = {
  id?: string;
  record_non_host: boolean;
  record_recurring: boolean;
  record_external: boolean;
  record_internal: boolean;
  record_confirmed: boolean;
  record_only_host: boolean;
  bot_name: string;
};

export type User = {
  id: string;
  external_id: string;
  connections: CalendarConnection[];
  preferences: Preferences;
};

export type CalendarMeeting = {
  id: string;
  override_should_record: boolean;
  title: string;
  platform: MeetingPlatform;
  meeting_platform: MeetingPlatform;
  calendar_platform: CalendarPlatform;
  start_time: string;
  end_time: string;
  will_record: boolean;
  will_record_reason: string;
  bot_id: string | null;
};
