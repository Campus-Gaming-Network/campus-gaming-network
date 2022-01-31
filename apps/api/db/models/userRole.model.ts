import { DataTypes, Sequelize, ModelDefined, Optional } from "sequelize";

import { TABLES, MODELS } from "../../constants";

interface UserRoleAttributes {
  id: number;
  userId: number;
  teamId: number;
  schoolId: number;
  eventId: number;
  roleId: number;
}

interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, "schoolId" | "teamId" | "eventId"> {}

export default (
  sequelize: Sequelize
): ModelDefined<UserRoleAttributes, UserRoleCreationAttributes> => {
  return sequelize.define(
    MODELS.USER_ROLE,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: TABLES.USERS,
          key: "id",
        },
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: TABLES.TEAMS,
          key: "id",
        },
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: TABLES.EVENTS,
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: TABLES.ROLES,
          key: "id",
        },
      },
    },
    {
      tableName: TABLES.USER_ROLES,
    }
  );
};
