"use strict";

import { Sequelize } from "sequelize";

export const up = async ({ context: { queryInterface } }) => {
  await queryInterface.createTable("calendars", {
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
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    userId: {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: {
          tableName: "users",        
        },
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    autoRecordExternalEvents: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    autoRecordOnlyConfirmedEvents: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  await queryInterface.addConstraint("calendars", {
    fields: ["platform"],    
    type: "check",
    where: {
      platform: ["google_calendar", "microsoft_outlook"],
    },
  });
  await queryInterface.addIndex("calendars", ["recallId"], { unique: true });
  await queryInterface.addIndex("calendars", ["userId"]);
  await queryInterface.addIndex("calendars", ["platform"]);
};

export const down = async ({ context: { queryInterface } }) => {
  await queryInterface.removeConstraint("calendars", "calendars_platform_check");
  await queryInterface.removeIndex("calendars", ["recallId"]);
  await queryInterface.removeIndex("calendars", ["userId"]);
  await queryInterface.removeIndex("calendars", ["platform"]);
  await queryInterface.dropTable("calendars");
};
