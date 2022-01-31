import { DataTypes, Sequelize, ModelDefined } from "sequelize";

import { TABLES, MODELS } from "../../constants";

export default (sequelize: Sequelize): ModelDefined<any, any> => {
  return sequelize.define(
    MODELS.SCHOOL_USER,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.USERS,
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
      tableName: TABLES.SCHOOL_USERS,
    }
  );
};
