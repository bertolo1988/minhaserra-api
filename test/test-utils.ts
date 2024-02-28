import { Knex } from 'knex';
import CONFIG from '../src/config';
import { getDatabaseInstance } from '../src/knex-database';

function isTestEnvironment() {
  return CONFIG.env === 'test';
}

export async function truncateAllTables() {
  if (isTestEnvironment()) {
    const knex = await getDatabaseInstance();
    return knex.raw(
      `TRUNCATE TABLE users, addresses, contact_verifications RESTART IDENTITY CASCADE;`,
    );
  } else {
    throw new Error('Can only truncate tables in test environment!');
  }
}

export enum DatabaseSeedNames {
  CLEAN_DATABASE = 'clean-database.seed.ts',
  LOGIN = 'login.seed.ts',
  VERIFY_USER_EMAIL = 'verify-user-email.seed.ts',
}

export async function runSeedByName(
  seedName: DatabaseSeedNames,
): Promise<void> {
  if (isTestEnvironment()) {
    const knex = await getDatabaseInstance();
    try {
      const seedConfig: Knex.SeederConfig = { specific: seedName };
      await knex.seed.run(seedConfig);
    } catch (err) {
      console.error(`Failed to run seed: ${seedName}`, err);
      throw err;
    }
  } else {
    throw new Error('Can only seed the database in test environment!');
  }
}
