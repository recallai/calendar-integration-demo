import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "CalendarEvent",
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
      shouldRecordAutomatic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      shouldRecordManual: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },

      startTime: {
        type: DataTypes.VIRTUAL,
        get() {
          return new Date(this.recallData["start_time"]);
        },
        set() {
          throw new Error("NOT_ALLOWED");
        },
      },
      endTime: {
        type: DataTypes.VIRTUAL,
        get() {
          return new Date(this.recallData["end_time"]);
        },
        set() {
          throw new Error("NOT_ALLOWED");
        },
      },
      title: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.platform === "google_calendar"
            ? this.recallData.raw["summary"]
            : this.recallData.raw["subject"];
        },
        set() {
          throw new Error("NOT_ALLOWED");
        },
      },
      meetingUrl: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.recallData["meeting_url"];
        },
        set() {
          throw new Error("NOT_ALLOWED");
        },
      },
      bots: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.recallData["bots"] || [];
        },
        set() {
          throw new Error("NOT_ALLOWED");
        },
      },
    },
    {
      sequelize,
      tableName: "calendar_events",
      modelName: "CalendarEvent",
    }
  );
};
