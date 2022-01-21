import { DataTypes, Sequelize, ModelDefined, Optional } from 'sequelize';

import { TABLES, MODELS, MAX_DESCRIPTION_LENGTH } from '../../constants';

interface TeamAttributes {
  id: number;
  name: string;
  shortName: string;
  website: string;
  description: string;
  joinHash: string;
}

interface TeamCreationAttributes
  extends Optional<TeamAttributes, "shortName" | "website" | "description"> {}

export default (sequelize: Sequelize): ModelDefined<TeamAttributes, TeamCreationAttributes> => {
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
