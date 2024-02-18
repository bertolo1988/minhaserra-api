import { getDatabaseInstance } from '../src/knex-database';

export async function truncateAllTables() {
  if (process.env.NODE_ENV === 'test') {
    const knex = await getDatabaseInstance();
    return knex.raw(
      `TRUNCATE TABLE users, addresses, contact_verifications RESTART IDENTITY CASCADE;`,
    );
  } else {
    throw new Error('Can only truncate tables in test environment!');
  }
}
