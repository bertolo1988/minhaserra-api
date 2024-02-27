import { Knex } from 'knex';
import moment from 'moment';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';

const now = moment();

export const verifiedUserPassword = '9awj26AyDB%';
export const verifiedUser: UserModel = {
  id: 'dbd2199f-fda4-42dc-b2d4-c73051abd786',
  email: 'verified-user1@minhaserra.com',
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
  await knex('contact_verifications').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedUser),
    CaseConverter.objectKeysCamelToSnake(unverifiedUser),
  ]);
}
