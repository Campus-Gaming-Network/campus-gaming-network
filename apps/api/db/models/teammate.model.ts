import { DataTypes, Sequelize, ModelDefined } from "sequelize";

import { TABLES, MODELS } from "../../constants";

interface TeammateAttributes {
  id: number;
  userId: number;
  teamId: number;
}

export default (
  sequelize: Sequelize
): ModelDefined<TeammateAttributes, TeammateAttributes> => {
  return sequelize.define(
    MODELS.TEAMMATE,
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
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.TEAMS,
          key: "id",
        },
      },
    },
    {
      tableName: TABLES.TEAMMATES,
    }
  );
};
