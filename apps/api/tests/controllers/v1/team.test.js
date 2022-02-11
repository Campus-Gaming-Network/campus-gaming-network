const TestHelpers = require("../../test-helpers");
const models = require("../../../db/models");
const request = require("supertest");

describe("register", () => {
  let app;
  let newUserResponse;

  beforeAll(async () => {
    await TestHelpers.startDb();
    app = TestHelpers.getApp();
  });

  afterAll(async () => {
    await TestHelpers.stopDb();
  });

  beforeEach(async () => {
    await TestHelpers.syncDb();
    // newUserResponse = await TestHelpers.registerNewUser({
    //   email: 'test@example.com',
    //   password: 'Test123#',
    // });
  });

  it("should fail to create a team unauthorized", async () => {
    await request(app).post("/v1/teams").send({}).expect(401);
  });

  it("should create a team succesfully", async () => {
    const newTeam = {
      name: "Test Team",
      shortName: "TT",
      website: "www.testteam.gg",
      description: "This is a test team",
      joinHash: "password",
    };

    await request(app)
      .post("/v1/teams")
      .set("Authorization", "Bearer invalidToken")
      .send(newTeam)
      .expect(200);
  });

  //   it('should return 401 if we pass an email that is not associated with any user', async () => {
  //     const response = await request(app)
  //       .post('/v1/login')
  //       .send({ email: 'test@example.net', password: 'Test123#' })
  //       .expect(401);
  //     expect(response.body.success).toEqual(false);
  //     expect(response.body.message).toEqual('Invalid credentials');
  //   });

  //   it('should return 401 if we pass an invalid password', async () => {
  //     const response = await request(app)
  //       .post('/v1/login')
  //       .send({ email: 'test@example.com', password: 'invalidpassword' })
  //       .expect(401);
  //     expect(response.body.success).toEqual(false);
  //     expect(response.body.message).toEqual('Invalid credentials');
  //   });

  //   it('should create a new refresh token record if there is not one associated with the user', async () => {
  //     const { RefreshToken } = models;
  //     await RefreshToken.destroy({ where: {} });
  //     let refreshTokensCount = await RefreshToken.count();
  //     expect(refreshTokensCount).toEqual(0);
  //     await request(app)
  //       .post('/v1/login')
  //       .send({ email: 'test@example.com', password: 'Test123#' })
  //       .expect(200);
  //     refreshTokensCount = await RefreshToken.count();
  //     expect(refreshTokensCount).toEqual(1);
  //   });

  //   it('should set the token field to a JWT if this field is empty', async () => {
  //     const { RefreshToken } = models;
  //     const refreshToken = newUserResponse.body.data.refreshToken;
  //     const savedRefreshToken = await RefreshToken.findOne({
  //       where: { token: refreshToken },
  //     });
  //     savedRefreshToken.token = null;
  //     await savedRefreshToken.save();
  //     await request(app)
  //       .post('/v1/login')
  //       .send({ email: 'test@example.com', password: 'Test123#' })
  //       .expect(200);
  //     await savedRefreshToken.reload();
  //     expect(savedRefreshToken.token).not.toBeNull();
  //   });
});
