"use strict";

import { Sequelize } from "sequelize";

export const up = async ({ context: { queryInterface } }) => {
  await queryInterface.createTable("calendar_events", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    platform: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    recallId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    recallData: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    shouldRecordAutomatic: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    shouldRecordManual: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    calendarId: {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: {
          tableName: "calendars",        
        },
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  await queryInterface.addConstraint("calendar_events", {
    fields: ["platform"],    
    type: "check",
    where: {
      platform: ["google_calendar", "microsoft_outlook"],
    },
  });
  await queryInterface.addIndex("calendar_events", ["recallId"], { unique: true });
  await queryInterface.addIndex("calendar_events", ["calendarId"]);
  await queryInterface.addIndex("calendar_events", ["platform"]);
};

export const down = async ({ context: { queryInterface } }) => {
  await queryInterface.removeConstraint("calendar_events", "calendar_events_platform_check");
  await queryInterface.removeIndex("calendar_events", ["recallId"]);
  await queryInterface.removeIndex("calendar_events", ["calendarId"]);
  await queryInterface.removeIndex("calendar_events", ["platform"]);
  await queryInterface.dropTable("calendar_events");
};
