import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import CONSTANTS from '../../src/constants';
import { PasswordResetModel } from '../../src/controllers/password-resets/password-resets.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';
import { SeedUtils } from '../seed-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();
const yearAgo = moment().subtract(1, 'year');

export const userData: UserModel = SeedUtils.getVerifiedUser();

export const passwordResetData: PasswordResetModel = {
  id: 'ad3632c9-3881-4519-bd1c-32afd7493140',
  userId: userData.id,
  token: 'nmtq0i9snsrql7fyuuwwxx74qzze7fco',
  expiresAt: moment()
    .add(CONSTANTS.PASSWORD_RESET_EXPIRY_HOURS, 'hours')
    .toDate(),
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const expiredPasswordReset: PasswordResetModel = {
  id: '732759b3-29c4-4f24-bbcb-70893d18b661',
  userId: userData.id,
  token: 'u0rldn01uiiyqd21hqbn6t503j0w3kvp',
  expiresAt: yearAgo
    .add(CONSTANTS.PASSWORD_RESET_EXPIRY_HOURS, 'hours')
    .toDate(),
  createdAt: yearAgo.toDate(),
  updatedAt: yearAgo.toDate(),
};

export const usedPasswordReset: PasswordResetModel = {
  id: '733daca5-9969-4914-9748-70b102f638ac',
  userId: userData.id,
  token: 'gelm1y46gllmho434mmqlm3w40i6fu6q',
  usedAt: now.toDate(),
  expiresAt: now.add(CONSTANTS.PASSWORD_RESET_EXPIRY_HOURS, 'hours').toDate(),
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('addresses').del();

  await knex('users').insert([CaseConverter.objectKeysCamelToSnake(userData)]);
  await knex('password_resets').insert([
    CaseConverter.objectKeysCamelToSnake(passwordResetData),
    CaseConverter.objectKeysCamelToSnake(expiredPasswordReset),
    CaseConverter.objectKeysCamelToSnake(usedPasswordReset),
  ]);
}
