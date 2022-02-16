const DB = require("../db").default;
const dbConfig = require("../db/config/config.js");

let db;

class TestHelpers {
  static async startDb() {
    db = new DB("test", dbConfig);
    await db.connect();
    return db;
  }

  static async stopDb() {
    await db.disconnect();
  }

  static async syncDb() {
    await db.sync();
  }

  static getApp() {
    const App = require("../app").default;
    return new App().getApp();
  }
}

module.exports = TestHelpers;
