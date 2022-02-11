import { DataTypes, Sequelize, ModelDefined } from "sequelize";

import { TABLES, MODELS } from "../../constants";

export default (sequelize: Sequelize): ModelDefined<any, any> => {
  return sequelize.define(
    MODELS.SCHOOL_TEAM,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.TEAMS,
          key: "id",
        },
      },
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.SCHOOLS,
          key: "id",
        },
      },
    },
    {
      tableName: TABLES.SCHOOL_TEAMS,
    }
  );
};
