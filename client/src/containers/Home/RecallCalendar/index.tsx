import { useState } from 'react';
import Loaders from "./Loaders";

import useRecallCalendar from "./hooks/useRecallCalendar";
import ConnectCalendar from "./ConnectCalendar";
import UpcomingMeetings from "./UpcomingMeetings";

interface IProps {
  userId: string;
  authUrl: string;
  googleOAuthClientId: string;
  msOAuthClientId: string;
}

export default function RecallCalendar(args: IProps) {
  const [showConnectionScreen, setShowConnectionScreen] = useState<boolean>(false)
  const recallCalendar = useRecallCalendar({
    authUrl: args.authUrl,
    userId: args.userId,
    googleOAuthClientId: args.googleOAuthClientId,
    msOAuthClientId: args.msOAuthClientId,
  });

  const needsCalendarConnection = (
    recallCalendar.user.data?.connections || []
  ).reduce((accum, { connected }) => accum && !connected, true);

  return (
    <div className="w-full overflow-hidden bg-white rounded-lg shadow">
      <div className="">
        {recallCalendar.initializeComplete ? (
          needsCalendarConnection || showConnectionScreen ? (
            <ConnectCalendar recallCalendar={recallCalendar} onShowMeetingsScreen={() => setShowConnectionScreen(false)} />
          ) : (
            <UpcomingMeetings recallCalendar={recallCalendar} onShowConnectionScreen={() => setShowConnectionScreen(true)} />
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-5">
            <Loaders.Ping />
            <span className="mt-3 text-xs text-gray-700">Initializing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
