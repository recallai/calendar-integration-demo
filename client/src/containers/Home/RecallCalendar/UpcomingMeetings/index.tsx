import { Fragment, useState } from "react";
import classNames from "classnames";
import { Switch } from "@headlessui/react";
import { format as formatDate } from "date-fns";
import ReactTooltip from "react-tooltip";

import type { UseRecallCalendarState } from "../hooks/useRecallCalendar";
import type { Preferences } from "../hooks/useRecallCalendar/models";
import Loaders from "../Loaders";

interface IUpcomingMeetingsProps {
  recallCalendar: UseRecallCalendarState;
  onShowConnectionScreen: () => void;
}

export default function UpcomingMeetings({
  recallCalendar,
  onShowConnectionScreen,
}: IUpcomingMeetingsProps) {
  const { meetings, refreshCalendar } = recallCalendar;
  const [showOnlyRecordableMeetings, setShowOnlyRecordableMeetings] =
    useState(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const filteredMeetings = (meetings.data || []).filter((m) => {
    return !showOnlyRecordableMeetings || m.platform;
  });

  return (
    <div className="flex flex-col pb-5">
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-300 sm:p-5">
        <h2 className="text-xl font-semibold text-gray-900 lg:mr-24">
          Upcoming meetings
        </h2>
        <div className="flex items-center ml-auto space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-1.5 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => refreshCalendar()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          {recallCalendar.user?.data?.preferences && (
            <button
              type="button"
              className="inline-flex items-center border border-gray-300 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-1.5 py-1 rounded-full"
              onClick={() => setShowSettings(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Settings
            </button>
          )}
        </div>
      </div>

      {!showSettings && meetings.refresh && (
        <div className="flex flex-col items-center justify-center p-4 my-2">
          <Loaders.Ping />
          <span className="mt-3 text-xs text-gray-700">
            Refreshing calendar...
          </span>
        </div>
      )}

      {!meetings.refresh && !showSettings && (
        <div className="relative flex px-4 mt-4">
          <div className="flex items-start mt-0.5 sm:mt-0 sm:items-center h-4.5">
            <input
              id="meeting-filter"
              name="meeting-filter"
              type="checkbox"
              className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded-lg focus:ring-indigo-500 cursor-pointer"
              checked={showOnlyRecordableMeetings}
              onChange={() =>
                setShowOnlyRecordableMeetings(!showOnlyRecordableMeetings)
              }
            />
          </div>
          <div className="ml-1 mr-auto text-xs">
            <label
              htmlFor="meeting-filter"
              className="font-medium text-gray-700 cursor-pointer"
            >
              Show only meetings that can be recorded
            </label>
          </div>
          <div
            className="flex ml-4 text-xs text-indigo-700 underline cursor-pointer hover:text-indigo-800"
            onClick={onShowConnectionScreen}
          >
            View Calendars
          </div>
        </div>
      )}

      {!meetings.refresh && !showSettings && filteredMeetings && (
        <Fragment>
          {filteredMeetings.length === 0 ? (
            <span className="max-w-xs px-4 mx-auto mt-4 text-xs text-center text-gray-400">
              No meetings matching your filter found. <br />
              Try changing the filter or refreshing your calendar
            </span>
          ) : (
            <Fragment>
              <ol className="mt-5 space-y-4 text-sm leading-6">
                {filteredMeetings.map((meeting, index) => {
                  const now = new Date();
                  const start = new Date(meeting.start_time);
                  const end = new Date(meeting.end_time);
                  const meetingTime = `${formatDate(
                    start,
                    "do MMM"
                  )} · ${formatDate(start, "hh:mm a")} - ${formatDate(
                    end,
                    "hh:mm a"
                  )}`;

                  const isOngoing = start.getTime() <= now.getTime();

                  return (
                    <li
                      key={meeting.id}
                      className="flex flex-col px-3 py-3 mx-4 border border-gray-200 rounded-md"
                    >
                      <div className="flex items-start">
                        <div className="flex flex-col flex-1">
                          <p className="font-medium text-gray-900 text">
                            {meeting.title}
                          </p>
                          <div className="flex mt-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p>{meetingTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="mr-2 capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {meeting.calendar_platform}
                            </span>
                            {isOngoing ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg
                                  className="-ml-0.5 mr-1 h-2 w-2 text-green-600"
                                  fill="currentColor"
                                  viewBox="0 0 8 8"
                                >
                                  <circle cx={4} cy={4} r={3} />
                                </svg>
                                Ongoing
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Upcoming
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end ml-auto">
                          <Switch.Group
                            as="div"
                            data-tip={meeting.will_record_reason}
                            data-place="bottom"
                            data-effect="solid"
                            data-padding="5px 8px"
                            className="flex flex-col items-end"
                          >
                            <Switch
                              checked={meeting.will_record}
                              onChange={(value: boolean) => {
                                recallCalendar.updateMeeting(meeting.id, value);
                              }}
                              className={classNames(
                                meeting.will_record
                                  ? "bg-green-600"
                                  : "bg-gray-200",
                                "relative inline-flex flex-shrink-0 h-4 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  meeting.will_record
                                    ? "translate-x-4"
                                    : "translate-x-0",
                                  "pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                )}
                              />
                            </Switch>
                            <Switch.Label as="span" className="">
                              <span className="text-xs font-medium text-gray-900">
                                Record call?
                              </span>
                            </Switch.Label>
                          </Switch.Group>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="px-4 mt-4 text-xs text-center text-gray-500">
                All your meetings in the next 14 days are loaded.
              </div>
            </Fragment>
          )}
        </Fragment>
      )}

      {showSettings && recallCalendar.user?.data?.preferences && (
        <div className="px-4 py-5 sm:p-6">
          <SettingsForm
            preferences={recallCalendar.user?.data?.preferences}
            savingPreferences={recallCalendar.user.savingPreferences}
            onCancel={() => setShowSettings(false)}
            onDisconnect={async () => {
              recallCalendar.disconnectCalendar(() => {
                console.log("calendar disconnected!");
                window.location.reload();
              });
            }}
            onSave={(updatedPreferences: Preferences) => {
              recallCalendar.savePreferences(updatedPreferences, () => {
                setShowSettings(false);
              });
            }}
          />
        </div>
      )}
      <ReactTooltip />
    </div>
  );
}

interface ISettingsFormProps {
  preferences: Preferences;
  savingPreferences: boolean;
  onSave: (preferences: Preferences) => void;
  onCancel: () => void;
  onDisconnect: () => void;
}

function SettingsForm({
  preferences,
  savingPreferences,
  onSave,
  onCancel,
  onDisconnect,
}: ISettingsFormProps) {
  const [formValues, setFormValues] = useState<Preferences>(preferences);

  return (
    <form
      className="flex flex-col space-y-6"
      onSubmit={() => {
        console.log("form submit!");
      }}
    >
      <div>
        <h3 className="font-medium leading-6 text-gray-900 text">
          Recording Preferences
        </h3>
        <p className="text-xs text-gray-500">
          Configure recording preferences for your account.
          <strong></strong>
        </p>
      </div>
      <div className="relative">
        <label
          htmlFor="bot_name"
          className="block text-xs font-medium text-gray-700"
        >
          Bot Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="bot_name"
            id="bot_name"
            className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter bot name..."
            aria-describedby="bot_name-description"
            value={formValues.bot_name}
            onChange={(event) =>
              setFormValues({
                ...formValues,
                bot_name: event.target.value,
              })
            }
          />
        </div>
        <p className="mt-2 text-xs text-gray-500" id="email-description">
          Set the name for the bot when it joins the meeting.
        </p>
      </div>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="record_external"
            aria-describedby="record_external-description"
            name="record_external"
            type="checkbox"
            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={formValues.record_external}
            onChange={(event) =>
              setFormValues({
                ...formValues,
                record_external: event.target.checked,
              })
            }
          />
        </div>
        <div className="ml-3 text-xs">
          <label
            htmlFor="record_external"
            className="font-medium text-gray-700 cursor-pointer"
          >
            Record external meetings
          </label>
          <p id="record_external-description" className="text-gray-500">
            Record meetings with external participants.
          </p>
        </div>
      </div>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="record_internal"
            aria-describedby="record_internal-description"
            name="record_internal"
            type="checkbox"
            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={formValues.record_internal}
            onChange={(event) =>
              setFormValues({
                ...formValues,
                record_internal: event.target.checked,
              })
            }
          />
        </div>
        <div className="ml-3 text-xs">
          <label
            htmlFor="record_internal"
            className="font-medium text-gray-700 cursor-pointer"
          >
            Record internal meetings
          </label>
          <p id="record_internal-description" className="text-gray-500">
            Record meetings with internal participants.
          </p>
        </div>
      </div>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="record_non_host"
            aria-describedby="record_non_host-description"
            name="record_non_host"
            type="checkbox"
            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={formValues.record_non_host}
            onChange={(event) =>
              setFormValues({
                ...formValues,
                record_non_host: event.target.checked,
              })
            }
          />
        </div>
        <div className="ml-3 text-xs">
          <label
            htmlFor="record_non_host"
            className="font-medium text-gray-700 cursor-pointer"
          >
            Record meetings where I'm not the organizer
          </label>
          <p id="record_non_host-description" className="text-gray-500">
            Record meetings I didn’t make and are just invited to.
          </p>
        </div>
      </div>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="record_recurring"
            aria-describedby="record_recurring-description"
            name="record_recurring"
            type="checkbox"
            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={formValues.record_recurring}
            onChange={(event) =>
              setFormValues({
                ...formValues,
                record_recurring: event.target.checked,
              })
            }
          />
        </div>
        <div className="ml-3 text-xs">
          <label
            htmlFor="record_recurring"
            className="font-medium text-gray-700 cursor-pointer"
          >
            Record recurring meetings
          </label>
          <p id="record_recurring-description" className="text-gray-500">
            Record meetings that repeat on my calendar.
          </p>
        </div>
      </div>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="record_confirmed"
            aria-describedby="record_confirmed-description"
            name="record_confirmed"
            type="checkbox"
            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={formValues.record_confirmed}
            onChange={(event) =>
              setFormValues({
                ...formValues,
                record_confirmed: event.target.checked,
              })
            }
          />
        </div>
        <div className="ml-3 text-xs">
          <label
            htmlFor="record_confirmed"
            className="font-medium text-gray-700 cursor-pointer"
          >
            Record confirmed meetings
          </label>
          <p id="record_confirmed-description" className="text-gray-500">
            Record only meetings that you have accepted to attend.
          </p>
        </div>
      </div>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            id="record_only_host"
            aria-describedby="record_only_host-description"
            name="record_only_host"
            type="checkbox"
            className="w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={formValues.record_only_host}
            onChange={(event) =>
              setFormValues({
                ...formValues,
                record_only_host: event.target.checked,
              })
            }
          />
        </div>
        <div className="ml-3 text-xs">
          <label
            htmlFor="record_only_host"
            className="font-medium text-gray-700 cursor-pointer"
          >
            Record only self hosted
          </label>
          <p id="record_confirmed-description" className="text-gray-500">
            Record only meetings that you have organized/created.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <button
          type="button"
          className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-auto"
          onClick={onDisconnect}
          disabled={savingPreferences}
        >
          Disconnect
        </button>
        <button
          type="button"
          className="inline-flex items-center border border-gray-300 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-2.5 py-1 rounded-full"
          onClick={onCancel}
          disabled={savingPreferences}
        >
          Back
        </button>
        <button
          type="button"
          className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => onSave(formValues)}
          disabled={savingPreferences}
        >
          {savingPreferences ? (
            <Loaders.Spinner className="w-4 h-4 text-white" />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}
