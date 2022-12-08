import React from "react";
import RecallCalendar from "./RecallCalendar";
import useLocalUser from "./hooks/useLocalUser";


export default function HomeContainer() {
  const localUser = useLocalUser();
  const authUrl = process.env.REACT_APP_AUTH_URL || ''
  
  return (
    <div className="flex flex-col items-center h-screen pt-6 pb-12 overflow-y-auto bg-gray-100 lg:pt-20">
      <div className="flex flex-col justify-center max-w-4xl space-y-1 min-w-xl">
        <h3 className="mb-2 text-sm leading-6 text-gray-700">
          <a
            href="https://www.recall.ai/"
            target="_blank"
            className="underline"
            rel="noreferrer"
          >
            Recall.ai
          </a>{" "}
          calendar integration demo
        </h3>
        {localUser?.id ? (
          <RecallCalendar
            userId={localUser.id}
            authUrl={authUrl}
            googleOAuthClientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ""}
            msOAuthClientId={process.env.REACT_APP_MICROSOFT_OAUTH_CLIENT_ID || ""}
          />
        ) : null}
      </div>
    </div>
  );
}
