import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import { AddressModel } from '../../src/controllers/addresses/addresses.types';
import { UserModel } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { SeedUtils } from '../seed-utils';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

export const verifiedUserBuyer: UserModel = SeedUtils.getVerifiedUser();
export const inactiveUser: UserModel = SeedUtils.getInactiveUser();
export const nonVerifiedUser: UserModel = SeedUtils.getNonVerifiedUser();
export const softDeletedUser: UserModel = SeedUtils.getSoftDeletedUser();

export const inactiveUserAddress: AddressModel = SeedUtils.getUserAddress(
  inactiveUser,
  'c60f6824-1dd2-4eb9-b168-f8936b776185',
);

export const verifiedUserBuyerAddress: AddressModel = SeedUtils.getUserAddress(
  verifiedUserBuyer,
  '2858f2c9-3b25-47c2-a344-11996ec750e1',
);

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('addresses').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(nonVerifiedUser),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyer),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
  ]);
  await knex('addresses').insert([
    CaseConverter.objectKeysCamelToSnake(inactiveUserAddress),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerAddress),
  ]);
}
