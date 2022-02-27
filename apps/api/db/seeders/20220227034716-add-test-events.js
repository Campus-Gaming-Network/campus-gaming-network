"use strict";

const chance = require("chance").Chance();

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

const getDescription = () => {
  return chance
    .paragraph({ sentences: chance.integer({ min: 1, max: 500 }) })
    .substring(0, 5000);
};

const getDateTimes = () => {
  const startYear = chance.integer({ min: 1980, max: 2050 });
  const startMonth = chance.integer({ min: 0, max: 11 });
  const startDay = chance.integer({ min: 1, max: 29 });

  const endYear = chance.integer({ min: startYear, max: 2100 });
  const sameYear = startYear === endYear;

  const endMonth = chance.integer({ min: sameYear ? startMonth : 0, max: 11 });
  const sameMonth = startMonth === endMonth;

  const minEndDay = sameYear && sameMonth ? startDay : 0;
  const endDay = chance.integer({ min: minEndDay, max: 29 });

  return {
    startDateTime: new Date(startYear, startMonth, startDay),
    endDateTime: new Date(endYear, endMonth, endDay),
  };
};

const getLocation = () => {
  return [
    chance.address({ short_suffix: true }),
    chance.city(),
    chance.country(),
    chance.zip(),
  ].join(", ");
};

const getName = () => {
  const words = chance.integer({ min: 1, max: 20 });
  return chance.sentence({ words }).replace(".", "").substring(0, 255);
};

const createEvent = () => {
  const isOnlineEvent = chance.bool();
  const { startDateTime, endDateTime } = getDateTimes();

  let placeId = "";
  let location = "";

  if (!isOnlineEvent) {
    placeId = chance.guid();
    location = getLocation();
  }

  return {
    name: getName(),
    creatorId: chance.integer({ min: 1, max: 15 }),
    schoolId: chance.integer({ min: 1, max: 15 }),
    description: getDescription(),
    isOnlineEvent,
    game: JSON.stringify(chance.pickone(TEST_GAMES)),
    placeId,
    location,
    pageViews: chance.integer({ min: 1, max: 100000 }),
    startDateTime,
    endDateTime,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const createParticipant = (eventId) => {
  return {
    userId: chance.integer({ min: 1, max: 1000 }),
    eventId,
    participantType: "SOLO",
    response: chance.pickone(["YES", "NO"]),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

module.exports = {
  async up(queryInterface) {
    const totalEvents = 1000;
    const totalParticipants = 300;
    let events = [];
    let participants = [];

    for (let i = 0; i < totalEvents; i++) {
      const event = createEvent();
      const eventId = i + 1;

      participants.push({
        userId: event.creatorId,
        eventId,
        participantType: "SOLO",
        response: "YES",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      for (let j = 0; j < totalParticipants; j++) {
        if (j === event.creatorId) {
          continue;
        }

        const participant = createParticipant(eventId);

        participants.push(participant);
      }

      events.push(event);
    }

    console.log("Bulk inserting events...");

    await queryInterface.bulkInsert("events", events, {});
    console.log("Bulk inserting participants...");
    try {
      await queryInterface.bulkInsert("participants", participants, {});
    } catch (error) {
      console.log("e", error);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("participants", null, {});
    return queryInterface.bulkDelete("events", null, {});
  },
};
