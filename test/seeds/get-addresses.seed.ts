import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import { AddressModel } from '../../src/controllers/addresses/addresses.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';
import { SeedUtils } from '../seed-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();

export const verifiedUserBuyerPasswordA: string =
  SeedUtils.getVerifiedUserPassword();
export const verifiedUserBuyerA: UserModel = SeedUtils.getVerifiedUser();

export const verifiedUserBuyerPasswordB = '9awj26AyDB%';
export const verifiedUserBuyerB: UserModel = {
  id: '8b27a088-eb8d-493f-a859-d7f8e1f3d795',
  email: 'verified-user-buyer-b@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'John',
  lastName: 'Doe',
  birthDate: moment('1990-01-01').toDate(),
  isActive: true,
  isEmailVerified: true,
  isDeleted: false,
  passwordHash:
    '25994d71c411e6c679bfc5974669fe97972055817bbc02d94c99058405597fdb27a99017c86886ebafff0ff1185cce7ce4b32561333f1fa711e167bae66c972c802eee978747c025cb642950d21d6855294486d0a3a7ba6b6aa296ea8ac35a2df63e9aa703f368c047c9702bae5afb3ad83573243faf683052333254efcd8339',
  passwordSalt:
    '28666637e639d87832b19346772c2deeb22468b2ca3c95cc332f68bc04b2be07',
  passwordIterations: 128,
  termsVersion: 1,
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const verifiedUserBuyerAAddress1: AddressModel =
  SeedUtils.getUserAddress(
    verifiedUserBuyerA,
    '2858f2c9-3b25-47c2-a344-11996ec750e1',
  );

export const verifiedUserBuyerAAddress2: AddressModel =
  SeedUtils.getUserAddress(
    verifiedUserBuyerA,
    '30ab9e6e-de46-4038-b6dd-49931eeee601',
  );

export const verifiedUserBuyerAAddress3: AddressModel =
  SeedUtils.getUserAddress(
    verifiedUserBuyerA,
    '0081b424-5178-4a8a-a09f-92d0a0bb00fb',
  );

export const inactiveUserPassword: string = SeedUtils.getInactiveUserPassword();
export const inactiveUser: UserModel = SeedUtils.getInactiveUser();

export const nonVerifiedUserPassword: string =
  SeedUtils.getNonVerifiedUserPassword();
export const nonVerifiedUser: UserModel = SeedUtils.getNonVerifiedUser();

export const softDeletedUserPassword: string =
  SeedUtils.getSoftDeletedUserPassword();
export const softDeletedUser: UserModel = SeedUtils.getSoftDeletedUser();

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('addresses').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerA),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerB),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(nonVerifiedUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
  ]);
  await knex('addresses').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerAAddress1),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerAAddress2),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerAAddress3),
  ]);
}
