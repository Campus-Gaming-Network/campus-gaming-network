const TestHelpers = require("../../test-helpers");
const request = require("supertest");

const TEST_USER = {
  uid: "123",
  email: "support@campusgamingnetwork.com",
  password: "password",
  firstName: "First",
  lastName: "Last",
  status: "FRESHMAN",
  gravatar: "fakegravatar",
  schoolId: 1,
  major: "Information Technology",
  minor: null,
  bio: "Test bio",
  timezone: "America/Denver",
  hometown: "Chicago, IL",
  birthdate: null,
  website: "campusgamingnetwork.com",
  twitter: "CampusGamingNet",
  twitch: null,
  youtube: null,
  skype: null,
  discord: null,
  battlenet: null,
  steam: null,
  xbox: null,
  psn: null,
  currentlyPlaying: [],
  favoriteGames: [],
};

describe("Users", () => {
  let app;

  beforeAll(async () => {
    await TestHelpers.startDb();
    app = TestHelpers.getApp();
  });

  afterAll(async () => {
    await TestHelpers.stopDb();
  });

  beforeEach(async () => {
    await TestHelpers.syncDb();
    await TestHelpers.seedDb();
  });

  it("should GET all users succesfully", async () => {
    await request(app).get("/v1/users").expect(200);
  });

  // it("should POST a user succesfully", async () => {
  //   await request(app)
  //     .post("/v1/users")
  //     .set("Content-Type", "application/json")
  //     .send(TEST_USER)
  //     .expect(200);
  // });
});
