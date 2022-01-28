import { DataTypes, Sequelize, ModelDefined } from 'sequelize';

import { TABLES, MODELS, PARTICIPANT_TYPES } from '../../constants';

export default (sequelize: Sequelize): ModelDefined<any, any> => {
  return sequelize.define(
    MODELS.PARTICIPANT_TYPE,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.keys(PARTICIPANT_TYPES)),
        allowNull: false,
      },
    },
    {
      tableName: TABLES.PARTICIPANT_TYPES,
    },
  );
};
