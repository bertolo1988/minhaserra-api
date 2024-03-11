import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import CONSTANTS from '../../src/constants';
import { PasswordResetModel } from '../../src/controllers/password-resets/password-resets.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();
const yearAgo = moment().subtract(1, 'year');

export const userData: UserModel = {
  id: 'fb600955-7a33-4c0c-b40f-6c7ac5b8e90f',
  email: 'user4@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'Abel',
  lastName: 'Timoteo',
  isActive: true,
  isEmailVerified: true,
  isDeleted: false,
  // password 'r9p6x2M9kR79oSycuxdi6CcHDXRnLkhQtUMr7ylhTyTPEC8ejEK65SuVugaMO1'
  passwordHash:
    '254b5b07b0c2b8837e4c1ba24a4cbed1c370cfe49d74d867260c5f46b96eb662a7eaebffac4e917710ef4dbefcf46a74f8290777de8c8d36f2555f07ab4e62c93cebf8b9f3f52eb32708564370425b1a73f4f56e793a8d61bf0b200bde4d901c5fc718b338d1538a8ac2f059d79883f7a669ffff6b3872e12dc0ccfa1e5fe04c',
  passwordSalt:
    'b2d1f913e7326957b042a034e2b021efef3001b0d0477455815914778063d47a',
  passwordIterations: CONSTANTS.DEFAULT_AMOUNT_OF_SALT_ITERATIONS,
  termsVersion: 1,
  createdAt: yearAgo.toDate(),
  updatedAt: yearAgo.toDate(),
};

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
  await knex('contact_verifications').del();

  await knex('users').insert([CaseConverter.objectKeysCamelToSnake(userData)]);
  await knex('password_resets').insert([
    CaseConverter.objectKeysCamelToSnake(passwordResetData),
    CaseConverter.objectKeysCamelToSnake(expiredPasswordReset),
    CaseConverter.objectKeysCamelToSnake(usedPasswordReset),
  ]);
}
