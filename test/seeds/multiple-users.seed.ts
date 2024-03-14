import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();

export const verifiedUserAdminPassword = '9awj26AyDB%';
export const verifiedUserAdmin: UserModel = {
  id: '56718a04-225e-42ba-a3e6-947d02172940',
  email: 'admin1@minhaserra.com',
  role: UserRole.ADMIN,
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

export const verifiedUserModeratorPassword = '9awj26AyDB%';
export const verifiedUserModerator: UserModel = {
  id: '5eb4212d-69f8-4dd4-94d8-4803e1f260e2',
  email: 'moderator1@minhaserra.com',
  role: UserRole.MODERATOR,
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

export const verifiedUserSellerPassword = '9awj26AyDB%';
export const verifiedUserSeller: UserModel = {
  id: '158eeb55-f52b-47a5-b3d9-67946980fced',
  email: 'verified-user-seller1@minhaserra.com',
  role: UserRole.SELLER,
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

export const unverifiedUserPassword = '9awj26AyDB%';
export const unverifiedUser: UserModel = {
  id: '350e3c16-c651-44f3-b0dd-43ec7845b91e',
  email: 'unverified-user1@minhaserra.com',
  role: UserRole.SELLER,
  firstName: 'Lorem',
  lastName: 'Ipsum',
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

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedUserAdmin),
    CaseConverter.objectKeysCamelToSnake(verifiedUserModerator),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyer),
    CaseConverter.objectKeysCamelToSnake(verifiedUserSeller),
    CaseConverter.objectKeysCamelToSnake(unverifiedUser),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
  ]);
}
