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
  email: "support@campusgamingnetwork.com",
  uid: "123",
};

const SCHOOL = {
  name: "Campus Gaming University",
};

const USER = {
  firstName: "Brandon",
  lastName: "Sansone",
  status: "FRESHMAN",
  gravatar: "xxxXXXxxx",
};

function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

before(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync("firestore.rules", "utf8");
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));

  // Write the coverage report to a file
  const coverageFile = `firestore-coverage-${Date.now()}.html`;
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

describe("Security Rules", () => {
  it("should allow a read to the schools collection", async () => {
    const db = getAuthedFirestore(null);

    const schoolsRef = db.collection(COLLECTIONS.SCHOOLS);

    await firebase.assertSucceeds(schoolsRef.get());
  });

  it("should allow a read to the users collection", async () => {
    const db = getAuthedFirestore(null);

    const usersRef = db.collection(COLLECTIONS.USERS);

    await firebase.assertSucceeds(usersRef.get());
  });

  it("should allow a read to the events collection", async () => {
    const db = getAuthedFirestore(null);

    const eventsRef = db.collection(COLLECTIONS.EVENTS);

    await firebase.assertSucceeds(eventsRef.get());
  });

  it("should allow a read to the event-responses collection", async () => {
    const db = getAuthedFirestore(null);

    const eventResponsesRef = db.collection(COLLECTIONS.EVENT_RESPONSES);

    await firebase.assertSucceeds(eventResponsesRef.get());
  });

  it("should allow a read to the game-queries collection", async () => {
    const db = getAuthedFirestore(null);

    const gameQueriesRef = db.collection(COLLECTIONS.GAME_QUERIES);

    await firebase.assertSucceeds(gameQueriesRef.get());
  });

  it("should deny a write to events when not logged in", async () => {
    const db = getAuthedFirestore(null);

    const eventsRef = db.collection(COLLECTIONS.EVENTS);

    await firebase.assertFails(eventsRef.add({ data: "something" }));
  });

  it("should allow a write to events when logged in", async () => {
    const db = getAuthedFirestore(AUTH_USER);

    const eventsRef = db.collection(COLLECTIONS.EVENTS);

    await firebase.assertSucceeds(eventsRef.add({ data: "something" }));
  });

  it("should deny a write to event-responses when not logged in", async () => {
    const db = getAuthedFirestore(null);

    const eventResponsesRef = db.collection(COLLECTIONS.EVENT_RESPONSES);

    await firebase.assertFails(eventResponsesRef.add({ data: "something" }));
  });

  it("should deny a write to users when not logged in", async () => {
    const db = getAuthedFirestore(null);

    const usersRef = db.collection(COLLECTIONS.USERS);

    await firebase.assertFails(usersRef.add({ data: "something" }));
  });

  it("should deny a write to schools", async () => {
    const db = getAuthedFirestore(null);

    const schoolsRef = db.collection(COLLECTIONS.SCHOOLS);

    await firebase.assertFails(schoolsRef.add({ data: "something" }));
  });

  it("should deny a write to game-queries", async () => {
    const db = getAuthedFirestore(null);

    const gameQueriesRef = db.collection(COLLECTIONS.GAME_QUERIES);

    await firebase.assertFails(gameQueriesRef.add({ data: "something" }));
  });
});
