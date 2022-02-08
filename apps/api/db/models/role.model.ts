import { DataTypes, Sequelize, ModelDefined } from "sequelize";

import { TABLES, MODELS } from "../../constants";

interface RoleAttributes {
  id: number;
  name: string;
  permissions: string[];
}

export default (
  sequelize: Sequelize
): ModelDefined<RoleAttributes, RoleAttributes> => {
  return sequelize.define(
    MODELS.ROLE,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      textkey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      tableName: TABLES.ROLES,
    }
  );
};
