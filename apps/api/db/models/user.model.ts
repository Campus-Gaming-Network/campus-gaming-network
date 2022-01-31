import { DataTypes, Sequelize, ModelDefined } from "sequelize";

import {
  TABLES,
  MODELS,
  USER_STATUSES,
  TIMEZONES,
  MAX_BIO_LENGTH,
} from "../../constants";

export default (sequelize: Sequelize): ModelDefined<any, any> => {
  return sequelize.define(
    MODELS.USER,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.keys(USER_STATUSES)),
        allowNull: false,
      },
      gravatar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      schoolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TABLES.SCHOOLS,
          key: "id",
        },
      },
      major: {
        type: DataTypes.STRING,
      },
      minor: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.STRING(MAX_BIO_LENGTH),
      },
      timezone: {
        type: DataTypes.ENUM(...TIMEZONES.map(({ value }) => value)),
      },
      hometown: {
        type: DataTypes.STRING,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
      },
      website: {
        type: DataTypes.STRING,
      },
      twitter: {
        type: DataTypes.STRING,
      },
      twitch: {
        type: DataTypes.STRING,
      },
      youtube: {
        type: DataTypes.STRING,
      },
      skype: {
        type: DataTypes.STRING,
      },
      discord: {
        type: DataTypes.STRING,
      },
      battlenet: {
        type: DataTypes.STRING,
      },
      steam: {
        type: DataTypes.STRING,
      },
      xbox: {
        type: DataTypes.STRING,
      },
      psn: {
        type: DataTypes.STRING,
      },
      currentlyPlaying: {
        type: DataTypes.JSONB,
      },
      favoriteGames: {
        type: DataTypes.JSONB,
      },
    },
    {
      tableName: TABLES.USERS,
    }
  );
};
