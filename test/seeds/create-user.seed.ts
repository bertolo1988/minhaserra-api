import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import CONSTANTS from '../../src/constants';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();

export const userData: UserModel = {
  id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
  email: 'user2@minhaserra.com',
  role: UserRole.BUYER,
  firstName: 'John',
  lastName: 'Doe',
  isActive: true,
  isEmailVerified: false,
  isDeleted: false,
  // password 'r9p6x2M9kR79oSycuxdi6CcHDXRnLkhQtUMr7ylhTyTPEC8ejEK65SuVugaMO1'
  passwordHash:
    '254b5b07b0c2b8837e4c1ba24a4cbed1c370cfe49d74d867260c5f46b96eb662a7eaebffac4e917710ef4dbefcf46a74f8290777de8c8d36f2555f07ab4e62c93cebf8b9f3f52eb32708564370425b1a73f4f56e793a8d61bf0b200bde4d901c5fc718b338d1538a8ac2f059d79883f7a669ffff6b3872e12dc0ccfa1e5fe04c',
  passwordSalt:
    'b2d1f913e7326957b042a034e2b021efef3001b0d0477455815914778063d47a',
  passwordIterations: CONSTANTS.DEFAULT_AMOUNT_OF_SALT_ITERATIONS,
  termsVersion: 1,
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('contact_verifications').del();

  await knex('users').insert([CaseConverter.objectKeysCamelToSnake(userData)]);
}
