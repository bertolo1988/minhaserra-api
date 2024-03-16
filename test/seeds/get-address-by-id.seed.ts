import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';
import { AddressModel } from '../../src/controllers/addresses/addresses.types';
import { Case } from 'change-case-all';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();

export const verifiedUserBuyerPassword = '9awj26AyDB%';
export const verifiedUserBuyer: UserModel = {
  id: 'dbd2199f-fda4-42dc-b2d4-c73051abd786',
  email: 'verified-user-buyer1@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'John',
  lastName: 'Doe',
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

export const verifiedUserBuyerAddress: AddressModel = {
  id: '2858f2c9-3b25-47c2-a344-11996ec750e1',
  userId: verifiedUserBuyer.id,
  label: 'My first home',
  name: 'John Doe',
  lineTwo: 'n 99',
  lineOne: 'Xihu Road',
  city: 'Guangzhou',
  region: 'Yuexiu District',
  postalCode: '510030',
  countryCode: 'CN',
  phoneNumber: '1234567890',
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const inactiveUserPassword = '9awj26AyDB%';
export const inactiveUser: UserModel = {
  id: '97e7b37f-c1ae-44b2-a68f-df476fbeec8b',
  email: 'inactive-user-1@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'Adam',
  lastName: 'Bell',
  isActive: false,
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

export const inactiveUserAddress: AddressModel = {
  id: 'c60f6824-1dd2-4eb9-b168-f8936b776185',
  userId: inactiveUser.id,
  label: 'My first home',
  name: 'Adam',
  lineOne: '123 Main St',
  city: 'New York',
  region: 'NY',
  postalCode: '10001',
  countryCode: 'US',
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const softDeletedUserPassword = '9awj26AyDB%';
export const softDeletedUser: UserModel = {
  id: '22043ca6-9246-4182-9e9b-4aeb536abd42',
  email: 'soft-deleted-user1@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'Adam',
  lastName: 'Bell',
  isActive: true,
  isEmailVerified: true,
  isDeleted: true,
  passwordHash:
    '25994d71c411e6c679bfc5974669fe97972055817bbc02d94c99058405597fdb27a99017c86886ebafff0ff1185cce7ce4b32561333f1fa711e167bae66c972c802eee978747c025cb642950d21d6855294486d0a3a7ba6b6aa296ea8ac35a2df63e9aa703f368c047c9702bae5afb3ad83573243faf683052333254efcd8339',
  passwordSalt:
    '28666637e639d87832b19346772c2deeb22468b2ca3c95cc332f68bc04b2be07',
  passwordIterations: 128,
  termsVersion: 1,
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export async function seed(knex: Knex): Promise<void> {
  await knex('addresses').del();
  await knex('users').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyer),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
  ]);
  await knex('addresses').insert([
    CaseConverter.objectKeysCamelToSnake(inactiveUserAddress),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerAddress),
  ]);
}
