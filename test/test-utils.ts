import { Knex } from 'knex';
import CONFIG from '../src/config';
import { getDatabaseInstance } from '../src/knex-database';
import { JwtUtils } from '../src/utils/jwt-utils';
import { UserModel } from '../src/controllers/users/users.types';

export function isProduction() {
  return (
    CONFIG.env?.toLowerCase() === 'production' ||
    CONFIG.env?.toLowerCase() === 'prod'
  );
}

export function isTestEnvironment() {
  return CONFIG.env?.toLowerCase() === 'test';
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
  GET_ADDRESSES = 'get-addresses.seed.ts',
  GET_ADDRESS_BY_ID = 'get-address-by-id.seed.ts',
  CLEAN_DATABASE = 'clean-database.seed.ts',
  MULTIPLE_USERS = 'multiple-users.seed.ts',
  VERIFY_USER_EMAIL = 'verify-user-email.seed.ts',
  CREATE_USER = 'create-user.seed.ts',
  CREATE_PASSWORD_RESET = 'create-password-reset.seed.ts',
  UPDATE_PASSWORD_UNAUTHENTICATED = 'update-password-unauthenticated.seed.ts',
  PRODUCTS_IMAGES = 'product-images.seed.ts',
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

export function getAuthorizationHeader(user: UserModel): string {
  return `Bearer ${JwtUtils.sign({
    id: user.id,
    role: user.role,
    email: user.email,
  })}`;
}
