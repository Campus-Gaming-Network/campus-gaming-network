import { DataTypes } from 'sequelize';

import { TABLES, MODELS, MAX_DESCRIPTION_LENGTH } from '../../constants';

export default (sequelize: any) => {
  return sequelize.define(
    MODELS.EVENT,
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
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.USERS,
          key: 'id',
        },
      },
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.SCHOOLS,
          key: 'id',
        },
      },
      description: {
        type: DataTypes.STRING(MAX_DESCRIPTION_LENGTH),
      },
      isOnlineEvent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      game: {
        // TODO
        // Maybe this should be its own table?
        type: DataTypes.JSONB,
      },
      placeId: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      pageViews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: TABLES.EVENTS,
    },
  );
};
