import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { SeedUtils } from '../seed-utils';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

export const verifiedSeller: UserModel = SeedUtils.getVerifiedUser(
  '760f0154-cbd1-447c-a875-9b58cda6bc72',
  UserRole.SELLER,
);

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller),
  ]);
}
