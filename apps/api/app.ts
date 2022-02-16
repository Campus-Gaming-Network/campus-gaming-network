import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import bodyParser from "body-parser";

import config from "./config";
import routes from "./routes";
import { decodeAuthToken } from "./auth";
import { ORIGIN_WHITELIST } from "./constants";

export default class App {
  app: any;

  constructor() {
    this.app = express();

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (
            process.env.NODE_ENV === "test" ||
            (!!origin && ORIGIN_WHITELIST.includes(origin))
          ) {
            callback(null, true);
          } else {
            callback(new Error());
          }
        },
      })
    );

    this.app.use(helmet());

    this.app.use(logger("common"));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(decodeAuthToken);

    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(routes);
  }

  getApp() {
    return this.app;
  }

  listen() {
    this.app.listen(config.port, () => {
      console.log(`Listening on port ${config.port}!`);
    });
  }
}
