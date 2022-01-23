import cls from 'cls-hooked';
import { Sequelize } from 'sequelize';
import { registerModels, setupModelAssociations } from './models';

export default class DB {
  environment: string;
  config: { [key: string]: any };
  isTesting: boolean;
  connection: any;

  constructor(environment: string, config: object) {
    this.environment = environment;
    this.config = config;
    this.isTesting = this.environment === 'test';
    this.connection = undefined;
  }

  async connect() {
    const namespace = cls.createNamespace('transactions-namespace');

    Sequelize.useCLS(namespace);

    const { username, password, host, port, database, dialect } = this.config[this.environment];

    this.connection = new Sequelize({
      username,
      password,
      host,
      port,
      database,
      dialect,
      logging: this.isTesting ? false : console.log,
    });

    try {
      await this.connection.authenticate();

      if (!this.isTesting) {
        console.log('Connection has been established successfully.');
      }
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    registerModels(this.connection);
    setupModelAssociations(this.connection);

    await this.sync();
  }

  async disconnect() {
    await this.connection.close();
  }

  async sync() {
    console.log('Attempting sync...');

    try {
      await this.connection.sync({
        force: this.isTesting,
      });
    } catch (error) {
      console.error('Unable to sync the database:', error);
    }

    if (!this.isTesting) {
      console.log('Connection synced successfully.');
    }
  }
}
