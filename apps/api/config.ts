import dotenv from 'dotenv';

dotenv.config();

export default {
  db: {
    development: {
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_DATABASE || 'postgres',
      dialect: 'postgres',
    },
    test: {
      username: process.env.DB_TEST_USERNAME || 'postgres',
      password: process.env.DB_TEST_PASSWORD || 'postgres',
      host: process.env.DB_TEST_HOST || 'localhost',
      port: Number(process.env.DB_TEST_PORT) || 5433,
      database: process.env.DB_TEST_DATABASE || 'postgres',
      dialect: 'postgres',
    },
  },
  port: Number(process.env.PORT) || 8080,
  env: process.env.NODE_ENV || 'production',
  isProd: process.env.NODE_ENV === 'production',
};
