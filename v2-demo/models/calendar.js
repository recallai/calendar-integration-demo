import { DataTypes } from "sequelize";

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
          return this.recallData["email"];
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
    },
    {
      sequelize,
      tableName: "calendars",
      modelName: "Calendar",
    }
  );
};
