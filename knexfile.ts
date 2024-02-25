import dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

if (
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_PORT ||
  !process.env.POSTGRES_DATABASE ||
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_PASSWORD
) {
  throw new Error('Missing environment variables for database connection');
}

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT as string),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    charset: 'utf8',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    directory: 'src/migrations',
  },
  seeds: {
    directory: 'test/seeds',
  },
};

module.exports = config;
