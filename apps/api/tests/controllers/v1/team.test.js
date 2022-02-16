const TestHelpers = require("../../test-helpers");
const request = require("supertest");
const firebasemock = require("firebase-mock");

const mockauth = new firebasemock.MockAuthentication();
const mocksdk = new firebasemock.MockFirebaseSdk(null, () => {
  return mockauth;
});

describe("team", () => {
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
    mocksdk.auth().autoFlush();
    mocksdk.auth().createUser({
      uid: "123",
      email: "test@test.com",
      password: "abc123",
    });
  });

  it("should create a team succesfully", async (done) => {
    const user = await mocksdk.auth().getUser("123");
    const token = await user.getIdToken();

    await request(app)
      .post("/v1/teams")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Team",
        shortName: "TT",
        website: "www.testteam.gg",
        description: "This is a test team",
        joinHash: "password",
      })
      .expect(200);
  });
});
