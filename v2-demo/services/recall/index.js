import { getClient } from "./api_client.js";

let client = null;
export default {
  initialize() {
    client = getClient();
  },
  
  createCalendar: async (data) => {
    return await client.request({
      path: "/api/v2/calendars/",
      method: "POST",
      data,
    });
  },
  getCalendar: async (id) => {
    return await client.request({
      path: `/api/v2/calendars/${id}`,
      method: "GET",
    });
  },
  updateCalendar: async ({ id, data }) => {
    return await client.request({
      path: `/api/v2/calendars/${id}`,
      method: "PUT",
      data,
    });
  },
  deleteCalendar: async (id) => {
    return await client.request({
      path: `/api/v2/calendars/${id}`,
      method: "DELETE",
    });
  },
  fetchCalendarEvents: async ({ id, lastUpdatedTimestamp }) => {
    let events = [];
    let pageUrl = client.buildUrl("/api/v2/calendar-events/", {
      calendar_id: id,
      updated_at__gte: lastUpdatedTimestamp,
    });

    while (true) {
      let { results, next } = await client.request({
        url: pageUrl,
        method: "GET",
      });
      events = events.concat(results);
      if (!next) {
        break;
      }

      // Recall API returns http:// urls when developing locally, but we need https:// urls
      if (next.indexOf("https:") === -1 && pageUrl.indexOf("https:") !== -1) {
        next = next.replace("http:", "https:");
      }
      pageUrl = next;
    }
    return events;
  },
};

// export async function createCalendar(data) {
//   const client = getClient();
//   return await client.request({
//     path: "/api/v2/calendars/",
//     method: "POST",
//     data,
//   });
// }
// export async function getCalendar(id) {
//   const client = getClient();
//   return await client.request({
//     path: `/api/v2/calendars/${id}`,
//     method: "GET",
//   });
// }
// export async function updateCalendar({ id, data }) {
//   const client = getClient();
//   return await client.request({
//     path: `/api/v2/calendars/${id}`,
//     method: "PUT",
//     data,
//   });
// }
// export async function deleteCalendar(id) {
//   const client = getClient();
//   return await client.request({
//     path: `/api/v2/calendars/${id}`,
//     method: "DELETE",
//   });
// }

// export async function fetchCalendarEvents({ id, updatedAtAfter }) {
//   const client = getClient();
//   let events = [];
//   let pageUrl = client.buildUrl("/api/v2/calendar-events", {
//     calendar_id: id,
//     updated_at_after: updatedAtAfter,
//   });

//   while (true) {
//     let { results, next } = await client.request({
//       url: pageUrl,
//       method: "GET",
//     });
//     events = events.concat(results);
//     if (!next) {
//       break;
//     }

//     // Recall API returns http:// urls when developing locally, but we need https:// urls
//     if (next.indexOf("https:") === -1 && pageUrl.indexOf("https:") !== -1) {
//       next = next.replace("http:", "https:");
//     }
//     pageUrl = next;
//   }

//   return events;
// }
