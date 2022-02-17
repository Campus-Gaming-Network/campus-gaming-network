const TestHelpers = require("../../test-helpers");
const request = require("supertest");

describe("Events", () => {
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
  });

  it("should GET all events succesfully", async () => {
    await request(app).get("/v1/events").expect(200);
  });
});
