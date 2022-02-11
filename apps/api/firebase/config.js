require("dotenv").config();

module.exports = {
  development: {
    serviceAccount: {
      privateKey: process.env.FIREBASE_LOCAL_ADMIN_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_LOCAL_ADMIN_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_LOCAL_ADMIN_PROJECT_ID,
    },
    databaseURL: process.env.FIREBASE_LOCAL_DATABASE_URL,
  },
  production: {
    serviceAccount: {
      privateKey: process.env.FIREBASE_PROD_ADMIN_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_PROD_ADMIN_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_PROD_ADMIN_PROJECT_ID,
    },
    databaseURL: process.env.FIREBASE_PROD_DATABASE_URL,
  },
  test: {
    serviceAccount: {
      privateKey: process.env.FIREBASE_TEST_ADMIN_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_TEST_ADMIN_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_TEST_ADMIN_PROJECT_ID,
    },
    databaseURL: process.env.FIREBASE_TEST_DATABASE_URL,
  },
};
