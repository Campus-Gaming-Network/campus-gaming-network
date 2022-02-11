import dotenv from "dotenv";

import dbConfig from "./db/config/config.js";
import firebaseConfig from "./firebase/config.js";

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test" | null;
    }
  }
}

export default {
  db: dbConfig,
  port: Number(process.env.PORT) || 8080,
  env: process.env.NODE_ENV || "production",
  isProd: process.env.NODE_ENV === "production",
  firebase: firebaseConfig,
};
