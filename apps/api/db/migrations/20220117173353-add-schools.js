"use strict";

const kebabCase = require("lodash.kebabcase");
const geohash = require("ngeohash");

const SCHOOLS = require("../../data/schools.json");

// Track duplicate handles
let handles = {};

const mapSchool = ({
  NAME,
  ADDRESS,
  CITY,
  COUNTRY,
  STATE,
  WEBSITE,
  ZIP,
  COUNTY,
  TELEPHONE,
  LATITUDE,
  LONGITUDE,
}) => {
  const now = new Date();
  const school = {
    name: NAME,
    address: ADDRESS,
    city: CITY,
    country: COUNTRY,
    state: STATE,
    website: WEBSITE,
    zip: String(ZIP),
    county: COUNTY,
    phone: String(TELEPHONE),
    location: [LATITUDE, LONGITUDE],
    geohash: LATITUDE && LONGITUDE ? geohash.encode(LATITUDE, LONGITUDE) : null,
    handle: kebabCase(NAME),
    createdAt: now,
    updatedAt: now,
  };

  if (school.handle in handles) {
    handles[school.handle] += 1;
    school.handle = `${school.handle}-${handles[school.handle]}`;
  } else {
    handles[school.handle] = 0;
  }

  return school;
};

const schools = SCHOOLS.map(mapSchool);

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("schools", {
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
    });

    await queryInterface.bulkInsert("schools", schools, {});
  },

  async down(queryInterface) {
    return queryInterface.dropTable("schools");
  },
};
