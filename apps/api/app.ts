import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import bodyParser from "body-parser";
import errorhandler from "errorhandler";

import config from "./config";
import routes from "./routes";

export default class App {
  app: any;

  constructor() {
    this.app = express();

    this.app.use(cors({ origin: "http://localhost:8080" }));
    this.app.use(helmet());
    this.app.use(logger("common"));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    if (!config.env) {
      this.app.use(errorhandler());
    }

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
