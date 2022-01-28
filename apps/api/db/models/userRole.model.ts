import { DataTypes, Sequelize, ModelDefined, Optional } from 'sequelize';

import { TABLES, MODELS } from '../../constants';

interface UserRoleAttributes {
  id: number;
  userId: number;
  roleId: number;
}

export default (sequelize: Sequelize): ModelDefined<UserRoleAttributes, any> => {
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
          key: 'id',
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: TABLES.ROLES,
          key: 'id',
        },
      },
    },
    {
      tableName: TABLES.USER_ROLES,
    },
  );
};
