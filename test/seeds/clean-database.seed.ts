import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

export async function seed(knex: Knex): Promise<void> {
  await knex('password_resets').del();
  await knex('contact_verifications').del();
  await knex('addresses').del();
  await knex('users').del();
}
