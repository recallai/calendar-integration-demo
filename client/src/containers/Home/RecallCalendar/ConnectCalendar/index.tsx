import { useState } from "react";

import type { UseRecallCalendarState } from "../hooks/useRecallCalendar";
import { CalendarPlatform } from "../hooks/useRecallCalendar/models";
import Loaders from "../Loaders";

interface IConnectCalendarProps {
  recallCalendar: UseRecallCalendarState;
  onShowMeetingsScreen: () => void;
}

export default function ConnectCalendar({
  recallCalendar,
  onShowMeetingsScreen,
}: IConnectCalendarProps) {
  const [connectingMessage, setConnectingMessage] = useState<string | null>(
    null
  );

  const needsCalendarConnection = (
    recallCalendar.user.data?.connections || []
  ).reduce((accum, { connected }) => accum && !connected, true);

  const microsoftConnection = (
    recallCalendar.user?.data?.connections || []
  ).filter(
    (connection) => connection.platform === CalendarPlatform.MICROSOFT
  )[0];

  const googleConnection = (
    recallCalendar.user?.data?.connections || []
  ).filter((connection) => connection.platform === CalendarPlatform.GOOGLE)[0];

  return connectingMessage ? (
    <div className="flex flex-col items-center justify-center p-6 text-xs">
      <Loaders.Ping />
      <div className="flex items-center mt-4">
        <span className="text-gray-700">{connectingMessage}</span>
        <span
          onClick={() => setConnectingMessage(null)}
          className="ml-1 text-indigo-500 underline cursor-pointer hover:text-indigo-700"
        >
          Cancel
        </span>
      </div>
    </div>
  ) : (
    <div className="flex flex-col px-4 py-5 space-y-4 sm:p-6">
      <div>
        {needsCalendarConnection ? (
          <p className="max-w-2xl mt-1 text-center text">
            Get started by connecting your calendar account.
          </p>
        ) : <span onClick={onShowMeetingsScreen} className="text-xs text-indigo-700 underline cursor-pointer hover:text-indigo-800">Back to meetings</span>}
      </div>
      <div className="flex flex-col items-stretch space-y-3">
        <div className="flex-col items-center p-3 mb-1 space-y-2 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center">
            <img
              className="w-4 h-auto"
              alt="Google Calendar Logo"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png"
            />
            <span className="ml-2 text-sm font-medium text-gray-600">
              Google Calendar
            </span>
          </div>
          {googleConnection?.connected ? (
            <div className="flex justify-center px-3 py-1.5 text-sm bg-gray-100 rounded-full">
              Connected: &nbsp;<strong>{googleConnection.email}</strong>
            </div>
          ) : (
            <button
              type="button"
              className="flex mx-auto px-5 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setConnectingMessage("Connecting google calendar.");
                recallCalendar.connectCalendar(CalendarPlatform.GOOGLE);
              }}
            >
              Connect
            </button>
          )}
        </div>

        <div className="flex-col items-center p-3 space-y-2 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center">
            <img
              className="w-6 h-auto"
              alt="Microsoft Outlook Calendar Logo"
              src="https://img.icons8.com/color/480/outlook-calendar.png"
            />
            <span className="ml-2 text-sm font-medium text-gray-600">
              Microsoft Outlook Calendar
            </span>
          </div>
          {microsoftConnection?.connected ? (
            <div className="flex justify-center px-3 py-1.5 text-sm bg-gray-100 rounded-full">
              Connected: &nbsp;<strong>{microsoftConnection.email}</strong>
            </div>
          ) : (
            <button
              type="button"
              className="flex mx-auto px-5 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setConnectingMessage("Connecting microsoft calendar.");
                recallCalendar.connectCalendar(CalendarPlatform.MICROSOFT);
              }}
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
