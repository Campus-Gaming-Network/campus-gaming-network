const firebase = require("@firebase/rules-unit-testing");
const fs = require("fs");
const http = require("http");

const PROJECT_ID = `rules-spec-${Date.now()}`;
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

const COLLECTIONS = {
  SCHOOLS: "schools",
  USERS: "users",
  EVENTS: "events",
  EVENT_RESPONSES: "event-responses",
  GAME_QUERIES: "game-queries",
};

const AUTH_USER = {
  uid: "user-123",
  email: "support@campusgamingnetwork.com",
};

const SCHOOL = {
  id: "school-123",
  name: "Campus Gaming University",
};

const USER = {
  firstName: "Brandon",
  lastName: "Sansone",
  status: "FRESHMAN",
  gravatar: "xxxXXXxxx",
  school: {...SCHOOL},
  major: "",
  minor: "",
  bio: "",
  timezone: "",
  hometown: "",
  birthdate: null,
  twitter: "",
  twitch: "",
  youtube: "",
  skype: "",
  discord: "",
  battlenet: "",
  steam: "",
  xbox: "",
  psn: "",
  currentlyPlaying: [],
  favoriteGames: [],
};

const GAME = {
  id: "game-123",
  name: "League of Legends",
  slug: "league-of-legends",
  cover: {
    id: "123",
    url: "some-url.jpg"
  },
};

const EVENT = {
  id: "event-123",
  name: "CGN Event",
  description: "This is a CGN event",
  isOnlineEvent: true,
  startDateTime: Date.now() - 1,
  endDateTime: Date.now(),
  game: GAME,
};

const EVENT_RESPONSE = {
  response: "YES",
  user: {...USER},
  event: {...EVENT},
  school: {...SCHOOL},
};

const GAME_QUERY = "League of Legends";

const GAME_QUERY_RESULTS = {
  games: [GAME],
};

const INITIAL_DATA = {
  [`${COLLECTIONS.SCHOOLS}/${SCHOOL.id}`]: {
    ...SCHOOL,
  },
  [`${COLLECTIONS.GAME_QUERIES}/${GAME.id}`]: {
    ...GAME,
  },
  [`${COLLECTIONS.USERS}/${AUTH_USER.uid}`]: {
    ...USER
  },
};

function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

function getAdminFirestore() {
  return firebase
    .initializeAdminApp({ projectId: PROJECT_ID })
    .firestore();
}

function updateUser(updatedData) {
  const db = getAuthedFirestore(AUTH_USER);

  return {
    ...USER,
    school: db.collection(COLLECTIONS.SCHOOLS).doc(SCHOOL.id),
    ...updatedData,
  };
}

function updateEvent(updatedData) {
  const db = getAuthedFirestore(AUTH_USER);

  return {
    ...EVENT,
    school: db.collection(COLLECTIONS.SCHOOLS).doc(SCHOOL.id),
    ...updatedData,
  };
}

async function setupInitialData() {
  const db = getAdminFirestore();

  for (const key in INITIAL_DATA) {
    const ref = db.doc(key);
    await ref.set(INITIAL_DATA[key]);
  }
}

setupInitialData();

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

before(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync("firestore-test.rules", "utf8");
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));

  // Write the coverage report to a file
  const coverageFile = "firestore-coverage.html";
  const fstream = fs.createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
      http.get(COVERAGE_URL, (res) => {
        res.pipe(fstream, { end: true });

        res.on("end", resolve);
        res.on("error", reject);
      });
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

describe("Users", () => {
  it("should allow a read to users when logged out", async () => {
    const db = getAuthedFirestore(null);

    const usersRef = db.collection(COLLECTIONS.USERS);

    await firebase.assertSucceeds(usersRef.get());
  });

  it("should allow a read to users when logged in", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const usersRef = db.collection(COLLECTIONS.USERS);

    await firebase.assertSucceeds(usersRef.get());
  });

  it("should deny a create to users when logged out", async () => {
    const db = getAuthedFirestore(null);

    const usersRef = db.collection(COLLECTIONS.USERS);

    await firebase.assertFails(usersRef.add(USER));
  });

  it("should deny a create to users when logged in", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const usersRef = db.collection(COLLECTIONS.USERS);

    await firebase.assertFails(usersRef.add(USER));
  });

  it("should allow a update to users when owner", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      major: "Major",
      minor: "Minor",
      bio: "bio",
      timezone: "America/Denver",
      hometown: "Chicago",
      birthdate: null,
      twitter: "twitter",
      twitch: "twitch",
      youtube: "youtube",
      skype: "skype",
      discord: "discord",
      battlenet: "battlenet",
      steam: "steam",
      xbox: "xbox",
      psn: "psn",
      currentlyPlaying: [GAME, GAME, GAME, GAME, GAME],
      favoriteGames: [GAME, GAME, GAME, GAME, GAME],
    });

    await firebase.assertSucceeds(userRef.set(updatedUser));
  });

  it("should allow a update to users with empty optional values", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      major: "",
      minor: "",
      bio: "",
      timezone: "",
      hometown: "",
      birthdate: null,
      twitter: "",
      twitch: "",
      youtube: "",
      skype: "",
      discord: "",
      battlenet: "",
      steam: "",
      xbox: "",
      psn: "",
      currentlyPlaying: [],
      favoriteGames: [],
    });

    await firebase.assertSucceeds(userRef.set(updatedUser));
  });

  it("should deny a update to users with empty required fields", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      firstName: "",
      lastName: "",
      status: "",
      gravatar: "",
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with untracked properties", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      foo: "foo",
      bar: "bar",
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with too long major", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      major: "foo".repeat(100),
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with null school", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      school: null,
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });
  
  it("should deny a update to users with null school details", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      school: null,
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with no school details id", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      school: {
        blah: null
      },
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with null school details id", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      school: {
        id: null
      },
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with bad timezone", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      timezone: "bad timezone",
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with too many currently playing games", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      currentlyPlaying: [GAME, GAME, GAME, GAME, GAME, GAME],
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a update to users with too many favorite games", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    const updatedUser = updateUser({
      favoriteGames: [GAME, GAME, GAME, GAME, GAME, GAME],
    });

    await firebase.assertFails(userRef.set(updatedUser));
  });

  it("should deny a delete to users if not owner", async () => {
    const db = getAuthedFirestore(null);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    await firebase.assertFails(userRef.delete());
  });

  it("should allow a delete to users if owner", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const userRef = db.collection(COLLECTIONS.USERS).doc(AUTH_USER.uid);

    await firebase.assertSucceeds(userRef.delete());
  });
});

describe("Schools", () => {
  it("should allow a read to the schools collection", async () => {
    const db = getAuthedFirestore(null);

    const schoolsRef = db.collection(COLLECTIONS.SCHOOLS);

    await firebase.assertSucceeds(schoolsRef.get());
  });

  it("should deny a write to schools", async () => {
    const db = getAuthedFirestore(null);

    const schoolsRef = db.collection(COLLECTIONS.SCHOOLS);

    await firebase.assertFails(schoolsRef.add(SCHOOL));
  });

  it("should deny a delete to schools", async () => {
    const db = getAuthedFirestore(null);

    const schoolsRef = db.collection(COLLECTIONS.SCHOOLS).doc(SCHOOL.id);

    await firebase.assertFails(schoolsRef.delete());
  });
});

describe("Events", () => {
  it("should allow a read to the events collection", async () => {
    const db = getAuthedFirestore(null);

    const eventsRef = db.collection(COLLECTIONS.EVENTS);

    await firebase.assertSucceeds(eventsRef.get());
  });

  it("should deny a write to events when not logged in", async () => {
    const db = getAuthedFirestore(null);

    const eventsRef = db.collection(COLLECTIONS.EVENTS);

    await firebase.assertFails(eventsRef.add(EVENT));
  });

  it("should allow a write to events when logged in", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const eventsRef = db.collection(COLLECTIONS.EVENTS);

    await firebase.assertSucceeds(eventsRef.add(EVENT));
  });

  it("should deny a delete to events if not owner", async () => {
    const db = getAuthedFirestore(null);

    const eventsRef = db.collection(COLLECTIONS.EVENTS).doc(EVENT.id);

    await firebase.assertFails(eventsRef.delete());
  });
});

describe("Event Responses", () => {
  it("should allow a read to the event-responses collection", async () => {
    const db = getAuthedFirestore(null);

    const eventResponsesRef = db.collection(COLLECTIONS.EVENT_RESPONSES);

    await firebase.assertSucceeds(eventResponsesRef.get());
  });

  it("should deny a write to event-responses when not logged in", async () => {
    const db = getAuthedFirestore(null);

    const eventResponsesRef = db.collection(COLLECTIONS.EVENT_RESPONSES);

    await firebase.assertFails(eventResponsesRef.add(EVENT_RESPONSE));
  });
});

describe("Game Queries", () => {
  it("should allow a read to the game-queries collection", async () => {
    const db = getAuthedFirestore(null);

    const gameQueriesRef = db.collection(COLLECTIONS.GAME_QUERIES);

    await firebase.assertSucceeds(gameQueriesRef.get());
  });

  it("should deny a write to game-queries", async () => {
    const db = getAuthedFirestore(null);

    const gameQueriesRef = db.collection(COLLECTIONS.GAME_QUERIES);

    await firebase.assertFails(gameQueriesRef.add(GAME_QUERY_RESULTS));
  });
});
