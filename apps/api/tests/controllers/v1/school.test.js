const TestHelpers = require("../../test-helpers");
const request = require("supertest");

describe("Schools", () => {
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

  it("should GET all schools succesfully", async () => {
    await request(app).get("/v1/schools").expect(200);
  });

  it("should GET a schoool by handle succesfully", async () => {
    await request(app).get("/v1/schools/test-school").expect(200);
  });

  it("should fail GET a schoool by handle", async () => {
    await request(app).get("/v1/schools/not-found").expect(404);
  });
});
