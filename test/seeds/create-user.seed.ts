import dotenv from 'dotenv';
dotenv.config();
import { Knex } from 'knex';

import { UserModel } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { SeedUtils } from '../seed-utils';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

export const userData: UserModel = SeedUtils.getNonVerifiedUser();

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('addresses').del();

  await knex('users').insert([CaseConverter.objectKeysCamelToSnake(userData)]);
}
