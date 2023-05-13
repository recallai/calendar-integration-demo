import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

import initUserModel from "./models/user.js";
import initCalendarModel from "./models/calendar.js";
import initCalendarEventModel from "./models/calendar-event.js";
import initCalendarWebhookModel from "./models/calendar-webhook.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = {};
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db.sqlite"),
  logging: false,
});

const umzug = new Umzug({
  migrations: {
    glob: "migrations/*.js",
    resolve: ({ name, path }) => {
      const getModule = () => import(`file:///${path.replace(/\\/g, "/")}`);
      return {
        name: name,
        path: path,
        up: async (upParams) => (await getModule()).up(upParams),
        down: async (downParams) => (await getModule()).down(downParams),
      };
    },
  },
  context: { queryInterface: sequelize.getQueryInterface() },
  storage: new SequelizeStorage({ sequelize }),
  logger: undefined,
});

export async function prepareDb() {
  await sequelize.authenticate();
  await umzug.up();
  console.log("Connection has been established successfully.");
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = initUserModel(sequelize);
db.Calendar = initCalendarModel(sequelize);
db.CalendarEvent = initCalendarEventModel(sequelize);
db.CalendarWebhook = initCalendarWebhookModel(sequelize);

db.User.hasMany(db.Calendar, { foreignKey: "userId" });
db.Calendar.belongsTo(db.User, { foreignKey: "userId" });

db.Calendar.hasMany(db.CalendarEvent, { foreignKey: "calendarId" });
db.Calendar.hasMany(db.CalendarWebhook, { foreignKey: "calendarId" });
db.CalendarEvent.belongsTo(db.Calendar, { foreignKey: "calendarId" });
db.CalendarWebhook.belongsTo(db.Calendar, { foreignKey: "calendarId" });

export default db;
