import { DataTypes } from 'sequelize';

import { TABLES, MODELS } from '../../constants';

export default (sequelize: any) => {
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
          key: 'id',
        },
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.TEAMS,
          key: 'id',
        },
      },
    },
    {
      tableName: TABLES.TEAMMATES,
    },
  );
};
