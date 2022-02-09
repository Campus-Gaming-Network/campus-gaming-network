"use strict";

const chance = require("chance").Chance();

const USER_STATUSES = [
  "FRESHMAN",
  "SOPHMORE",
  "JUNIOR",
  "SENIOR",
  "GRAD",
  "ALUMNI",
  "FACULTY",
  "OTHER",
];

const TIMEZONES = [
  "America/Puerto_Rico",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
];

const TEST_GAMES = [
  {
    cover: {
      id: 82068,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co1rbo.jpg",
    },
    id: 1879,
    name: "Terraria",
    slug: "terraria",
  },
  {
    cover: {
      id: 81905,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co1r75.jpg",
    },
    id: 11582,
    name: "Stellaris",
    slug: "stellaris",
  },
  {
    cover: {
      id: 136663,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co2xg7.jpg",
    },
    id: 9950,
    name: "Age of Empires II: Forgotten Empires",
    slug: "age-of-empires-ii-forgotten-empires",
  },
  {
    cover: {
      id: 123165,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co2n19.jpg",
    },
    id: 621,
    name: "Call of Duty",
    slug: "call-of-duty",
  },
  {
    cover: {
      id: 87278,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co1vce.jpg",
    },
    id: 1372,
    name: "Counter-Strike: Global Offensive",
    slug: "counter-strike-global-offensive",
  },
  {
    cover: {
      id: 93896,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co20g8.jpg",
    },
    id: 3480,
    name: "Earthworm Jim",
    slug: "earthworm-jim",
  },
  {
    cover: {
      id: 89684,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co1x78.jpg",
    },
    id: 2155,
    name: "Dark Souls",
    slug: "dark-souls",
  },
  {
    cover: {
      id: 120422,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co2kx2.jpg",
    },
    id: 427,
    name: "Final Fantasy VII",
    slug: "final-fantasy-vii",
  },
  {
    cover: {
      id: 85091,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co1tnn.jpg",
    },
    id: 239,
    name: "StarCraft II: Wings of Liberty",
    slug: "starcraft-ii-wings-of-liberty",
  },
  {
    cover: {
      id: 90408,
      url: "//images.igdb.com/igdb/image/upload/t_thumb/co1xrc.jpg",
    },
    id: 104967,
    name: "Valheim",
    slug: "valheim",
  },
];

const maybeVal = (val) => {
  return chance.pickone([val, null]);
};
const getStatus = () => {
  return chance.pickone(USER_STATUSES);
};
const getUsername = () => {
  return maybeVal(chance.word());
};
const getBirthdate = () => {
  const _year = chance.year({
    min: new Date().getFullYear() - 99,
    max: new Date().getFullYear() - 18,
  });
  const date = chance.birthday({ string: true, year: _year });
  const [month, day, year] = date.split("/");
  return maybeVal(`${year}/${month}/${day}`);
};
const getGames = () => {
  return JSON.stringify(
    chance.pickset(TEST_GAMES, chance.integer({ min: 0, max: 5 }))
  );
};
const getGravatarHash = () => {
  return chance.avatar().replace("//www.gravatar.com/avatar/", "");
};
const getHometown = () => {
  const city = maybeVal(chance.city());
  const state = maybeVal(chance.state());

  if (city && state) {
    return [city, state].join(", ");
  }

  return "";
};
const getTimezone = () => {
  return maybeVal(chance.pickone(TIMEZONES));
};

const createUser = () => {
  return {
    uid: chance.guid(),
    firstName: chance.first(),
    lastName: chance.last(),
    status: getStatus(),
    battlenet: getUsername(),
    bio: maybeVal(chance.sentence()),
    birthdate: getBirthdate(),
    currentlyPlaying: getGames(),
    discord: getUsername(),
    favoriteGames: getGames(),
    gravatar: getGravatarHash(),
    hometown: getHometown(),
    major: getUsername(),
    minor: getUsername(),
    psn: getUsername(),
    schoolId: chance.integer({ min: 1, max: 15 }),
    skype: getUsername(),
    steam: getUsername(),
    timezone: getTimezone(),
    twitch: getUsername(),
    twitter: getUsername(),
    website: maybeVal(chance.url()),
    xbox: getUsername(),
    youtube: getUsername(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

module.exports = {
  async up(queryInterface) {
    const users = [];

    const totalUsers = 1000;

    for (let index = 0; index < totalUsers; index++) {
      const user = createUser();
      users.push(user);
    }

    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
