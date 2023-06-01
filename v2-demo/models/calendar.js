import { DataTypes } from "sequelize";
import {
  buildGoogleCalendarOAuthUrl,
  buildMicrosoftOutlookOAuthUrl,
} from "../logic/oauth.js";

export default (sequelize) => {
  return sequelize.define(
    "Calendar",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      platform: {
        type: DataTypes.ENUM("google_calendar", "microsoft_outlook"),
        allowNull: false,
      },
      recallId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      recallData: {
        type: DataTypes.JSON,
        allowNull: false,
      },

      email: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.recallData["platform_email"];
        },
        set(value) {
          throw new Error("NOT_ALLOWED");
        },
      },
      status: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.recallData["status"];
        },
        set(value) {
          throw new Error("NOT_ALLOWED");
        },
      },
      connectUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          const state = { userId: this.userId, calendarId: this.id }
          return this.platform === "google_calendar" ? buildGoogleCalendarOAuthUrl(state) : buildMicrosoftOutlookOAuthUrl(state);
        },
        set(value) {
          throw new Error("NOT_ALLOWED");
        },
      }
    },
    {
      sequelize,
      tableName: "calendars",
      modelName: "Calendar",
    }
  );
};
