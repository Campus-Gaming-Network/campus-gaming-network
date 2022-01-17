import dotenv from 'dotenv';

// @ts-ignore
import dbConfig from './db/config/config.js';

dotenv.config();

export default {
  db: dbConfig,
  port: Number(process.env.PORT) || 8080,
  env: process.env.NODE_ENV || 'production',
  isProd: process.env.NODE_ENV === 'production',
};
