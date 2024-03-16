import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import { AddressModel } from '../../src/controllers/addresses/addresses.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();

export const verifiedUserBuyerPasswordA = '9awj26AyDB%';
export const verifiedUserBuyerA: UserModel = {
  id: 'dbd2199f-fda4-42dc-b2d4-c73051abd786',
  email: 'verified-user-buyer-a@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'Martin    ',
  lastName: 'King',
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

export const verifiedUserBuyerPasswordB = '9awj26AyDB%';
export const verifiedUserBuyerB: UserModel = {
  id: '8b27a088-eb8d-493f-a859-d7f8e1f3d795',
  email: 'verified-user-buyer-b@minhaserra.com',
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

export const verifiedUserBuyerAAddress1: AddressModel = {
  id: '2858f2c9-3b25-47c2-a344-11996ec750e1',
  userId: verifiedUserBuyerA.id,
  label: `John's house`,
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

export const verifiedUserBuyerAAddress2: AddressModel = {
  id: '30ab9e6e-de46-4038-b6dd-49931eeee601',
  userId: verifiedUserBuyerA.id,
  label: 'Sister house',
  name: 'Maria Doe',
  lineTwo: 'n 98',
  lineOne: 'Xihu Road',
  city: 'Guangzhou',
  region: 'Yuexiu District',
  postalCode: '510030',
  countryCode: 'CN',
  phoneNumber: '1234567890',
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const verifiedUserBuyerAAddress3: AddressModel = {
  id: '0081b424-5178-4a8a-a09f-92d0a0bb00fb',
  userId: verifiedUserBuyerA.id,
  label: 'Parents house',
  name: 'Ruth Doe',
  lineTwo: 'n 97',
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

export const nonVerifiedUserPassword = '9awj26AyDB%';
export const nonVerifiedUser: UserModel = {
  id: '42a00510-bbad-4538-825d-0d983bdec9e2',
  email: 'non-verified-user-1@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'Adam',
  lastName: 'Bell',
  isActive: true,
  isEmailVerified: false,
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
