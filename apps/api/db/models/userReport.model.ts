import { DataTypes, Sequelize, ModelDefined } from "sequelize";

import {
  TABLES,
  MODELS,
  MAX_REPORT_REASON_LENGTH,
  REPORT_ENTITIES,
  REPORT_STATUSES,
} from "../../constants";

export default (sequelize: Sequelize): ModelDefined<any, any> => {
  return sequelize.define(
    MODELS.USER_REPORT,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      reportingUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.USERS,
          key: "id",
        },
      },
      reason: {
        type: DataTypes.STRING(MAX_REPORT_REASON_LENGTH),
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSON,
      },
      entity: {
        type: DataTypes.ENUM(...REPORT_ENTITIES),
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.keys(REPORT_STATUSES)),
        allowNull: false,
        defaultValue: REPORT_STATUSES.NEW,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: TABLES.USER_REPORTS,
    }
  );
};
