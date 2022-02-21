import cls from "cls-hooked";
import { Sequelize, Options } from "sequelize";
import { registerModels, setupModelAssociations } from "./models";
import * as fs from "fs";

export default class DB {
  environment: string;
  config: { [key: string]: any };
  isTesting: boolean;
  isProduction: boolean;
  connection: any;

  constructor(environment: string, config: object) {
    this.environment = environment;
    this.config = config;
    this.isTesting = this.environment === "test";
    this.isProduction = this.environment === "production";
    this.connection = undefined;
  }

  async connect() {
    const namespace = cls.createNamespace("transactions-namespace");

    Sequelize.useCLS(namespace);

    const {
      username,
      password,
      host,
      port,
      database,
      dialect,
      ssl,
      dialectOptions,
    } = this.config[this.environment];

    let options: Options = {
      host,
      dialect,
      port,
      logging: this.isTesting ? false : console.log,
      ssl,
      dialectOptions,
    };

    this.connection = new Sequelize(database, username, password, options);

    try {
      await this.connection.authenticate();

      if (!this.isTesting) {
        console.log("Connection has been established successfully.");
      }
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    registerModels(this.connection);
    setupModelAssociations(this.connection);

    await this.sync();
  }

  async disconnect() {
    await this.connection.close();
  }

  async sync() {
    try {
      await this.connection.sync({
        force: this.isTesting,
      });
    } catch (error) {
      console.error("Unable to sync the database:", error);
    }

    if (!this.isTesting) {
      console.log("Connection synced successfully.");
    }
  }
}
