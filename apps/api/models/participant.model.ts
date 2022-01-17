import { DataTypes } from 'sequelize';

import { TABLES, MODELS } from '../constants';

export default (sequelize: any) => {
  return sequelize.define(
    MODELS.PARTICIPANT,
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
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.EVENTS,
          key: 'id',
        },
      },
      participantTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.PARTICIPANT_TYPES,
          key: 'id',
        },
      },
    },
    {
      tableName: TABLES.PARTICIPANTS,
    },
  );
};
