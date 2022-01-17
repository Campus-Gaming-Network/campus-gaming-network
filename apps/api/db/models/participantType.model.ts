import { DataTypes } from 'sequelize';

import { TABLES, MODELS, PARTICIPANT_TYPES, PARTICIPANT_RESPONSES } from '../../constants';

export default (sequelize: any) => {
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
      response: {
        type: DataTypes.ENUM(...Object.keys(PARTICIPANT_RESPONSES)),
        allowNull: false,
        defaultValue: PARTICIPANT_RESPONSES.YES,
      },
    },
    {
      tableName: TABLES.PARTICIPANT_TYPES,
    },
  );
};
