"use strict";

import { Sequelize } from "sequelize";

export const up = async ({ context: { queryInterface } }) => {
  await queryInterface.createTable("calendar_webhooks", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    event: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    payload: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    receivedAt: {
      type: Sequelize.DATE,
      allowNull: false,
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

  await queryInterface.addIndex("calendar_webhooks", ["calendarId"]);
  await queryInterface.addIndex("calendar_webhooks", ["event"]);
  await queryInterface.addIndex("calendar_webhooks", ["receivedAt"]);
};

export const down = async ({ context: { queryInterface } }) => {
  await queryInterface.removeIndex("calendar_webhooks", ["receivedAt"]);
  await queryInterface.removeIndex("calendar_webhooks", ["event"]);
  await queryInterface.removeIndex("calendar_webhooks", ["calendarId"]);
  await queryInterface.dropTable("calendar_webhooks");
};
