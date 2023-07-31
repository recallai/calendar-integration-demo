import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "CalendarWebhook",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },      
      event: {
        type: DataTypes.STRING,
        allowNull: false,        
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      receivedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }      
    },
    {
      sequelize,
      tableName: "calendar_webhooks",
      modelName: "CalendarWebhook",
    }
  );
};
