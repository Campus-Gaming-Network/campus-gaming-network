import { DataTypes } from 'sequelize';

import { TABLES, MODELS } from '../constants';

export default (sequelize: any) => {
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
      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      tableName: TABLES.ROLES,
    },
  );
};
