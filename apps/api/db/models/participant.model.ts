import { DataTypes, Sequelize, ModelDefined, Optional } from 'sequelize';

import { TABLES, MODELS, PARTICIPANT_RESPONSES } from '../../constants';

interface ParticipantAttributes {
  id: number;
  userId: number;
  teamId: number;
  eventId: number;
  type: "SOLO" | "TEAM";
  response: "YES" | "NO";
}

interface ParticipantCreationAttributes extends Optional<ParticipantAttributes, 'userId' | 'teamId'> {}

export default (sequelize: Sequelize): ModelDefined<ParticipantAttributes, ParticipantCreationAttributes> => {
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
        allowNull: true,
        references: {
          model: TABLES.USERS,
          key: 'id',
        },
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: TABLES.TEAMS,
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
      type: {
        type: DataTypes.ENUM("SOLO", "TEAM"),
        allowNull: false,
      },
      response: {
        type: DataTypes.ENUM(...Object.keys(PARTICIPANT_RESPONSES)),
        allowNull: false,
        defaultValue: PARTICIPANT_RESPONSES.YES,
      },
    },
    {
      tableName: TABLES.PARTICIPANTS,
    },
  );
};