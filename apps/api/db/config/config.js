require("dotenv").config();
const fs = require("fs");

module.exports = {
  development: {
    username: process.env.DB_LOCAL_USERNAME || "postgres",
    password: process.env.DB_LOCAL_PASSWORD || "postgres",
    host: process.env.DB_LOCAL_HOST || "localhost",
    port: Number(process.env.DB_LOCAL_PORT) || 5432,
    database: process.env.DB_LOCAL_DATABASE || "postgres",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_PROD_USERNAME || "postgres",
    password: process.env.DB_PROD_PASSWORD || "postgres",
    host: process.env.DB_PROD_HOST || "localhost",
    port: Number(process.env.DB_PROD_PORT) || 5432,
    database: process.env.DB_PROD_DATABASE || "postgres",
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync("../../../cgn-db.cer").toString(),
      },
    },
  },
  test: {
    username: process.env.DB_TEST_USERNAME || "postgres",
    password: process.env.DB_TEST_PASSWORD || "postgres",
    host: process.env.DB_TEST_HOST || "localhost",
    port: Number(process.env.DB_TEST_PORT) || 5433,
    database: process.env.DB_TEST_DATABASE || "postgres",
    dialect: "postgres",
  },
};
