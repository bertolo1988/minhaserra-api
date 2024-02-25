import { Knex } from 'knex';
import { getDatabaseInstance } from '../src/knex-database';

function isTestEnvironment() {
  return process.env.NODE_ENV === 'test';
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

export async function runSeedByName(seedName: string): Promise<void> {
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
