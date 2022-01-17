import { DataTypes } from 'sequelize';

import { TABLES, MODELS, MAX_DESCRIPTION_LENGTH } from '../../constants';

export default (sequelize: any) => {
  return sequelize.define(
    MODELS.TEAM,
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
      shortName: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING(MAX_DESCRIPTION_LENGTH),
      },
      joinHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: TABLES.TEAMS,
    },
  );
};
