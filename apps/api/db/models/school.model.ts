import { DataTypes } from 'sequelize';

import { TABLES, MODELS } from '../../constants';

export default (sequelize: any) => {
  return sequelize.define(
    MODELS.SCHOOL,
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
      handle: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      county: {
        type: DataTypes.STRING,
      },
      zip: {
        type: DataTypes.STRING,
      },
      geohash: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
      },
    },
    {
      tableName: TABLES.SCHOOLS,
    },
  );
};
