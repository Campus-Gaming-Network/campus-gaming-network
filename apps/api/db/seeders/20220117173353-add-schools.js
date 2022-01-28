'use strict';

const kebabCase = require('lodash.kebabcase');
const geohash = require('ngeohash');

const SCHOOLS = require('../../data/schools.json');

// Track duplicate handles
let handles = {};

const mapSchool = ({ NAME, ADDRESS, CITY, COUNTRY, STATE, WEBSITE, ZIP, COUNTY, TELEPHONE, LATITUDE, LONGITUDE }) => {
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
  async up(queryInterface) {
    await queryInterface.bulkInsert('schools', schools, {});
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('schools', null, {});
  },
};
