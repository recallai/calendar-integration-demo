import Recall from "../../services/recall/index.js";

// remove bot for deleted calendar event
export default async (job) => {
  const { recallEventId } = job.data;  
  console.log(`INFO: Delete bot for deleted recall event ${recallEventId}`);
  await Recall.removeBotFromCalendarEvent({
    id: recallEventId,
  });
};
