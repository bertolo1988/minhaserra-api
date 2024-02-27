import type { Knex } from 'knex';
import CONFIG from './src/config';

if (
  !CONFIG.database.host ||
  !CONFIG.database.port ||
  !CONFIG.database.database ||
  !CONFIG.database.user ||
  !CONFIG.database.password
) {
  throw new Error('Missing environment variables for database connection');
}

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: CONFIG.database.host,
    port: CONFIG.database.port,
    database: CONFIG.database.database,
    user: CONFIG.database.user,
    password: CONFIG.database.password,
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
