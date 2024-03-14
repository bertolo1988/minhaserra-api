import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
import moment from 'moment';
import CONSTANTS from '../../src/constants';
import {
  ContactVerifiationType,
  ContactVerificationModel,
} from '../../src/controllers/contact-verifications/contact-verifications.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();

export const manuelData: UserModel = {
  id: 'a4e1cd3d-8521-4927-8b05-aee70e3120fb',
  email: 'manuel1131230@minhaserra.com',
  role: UserRole.ADMIN,
  firstName: 'Manuel',
  lastName: 'Antunes',
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
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const johnData: UserModel = {
  id: '94a19b8d-3042-4617-a2a5-def487955c8d',
  email: 'user1@minhaserra.com',
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

export const manuelUsedContactVerification: ContactVerificationModel = {
  id: '3d4dcf6d-2574-42be-826b-1b7070ae4a10',
  userId: manuelData.id,
  type: ContactVerifiationType.EMAIL,
  contact: manuelData.email,
  verifiedAt: now.toDate(),
  expiresAt: moment()
    .add(CONSTANTS.CONTACT_VERIFICATION_EXPIRY_HOURS, 'hours')
    .toDate(),
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const johnContactVerification: ContactVerificationModel = {
  id: '97339c5e-09ff-4734-9ee9-d950a76b2b21',
  userId: johnData.id,
  type: ContactVerifiationType.EMAIL,
  contact: johnData.email,
  expiresAt: moment()
    .add(CONSTANTS.CONTACT_VERIFICATION_EXPIRY_HOURS, 'hours')
    .toDate(),
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const expiredJohnContactVerification: ContactVerificationModel = {
  id: 'bff48e73-29fb-4f5f-ae3b-882bcbe28afe',
  userId: johnData.id,
  type: ContactVerifiationType.EMAIL,
  contact: johnData.email,
  expiresAt: moment().subtract(1, 'minutes').toDate(),
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const johnContactVerificationInvalidEmail: ContactVerificationModel = {
  id: 'dabf91ee-5c1a-4f6a-8e58-220b52ee2160',
  userId: johnData.id,
  type: ContactVerifiationType.EMAIL,
  contact: 'wrong-john-email@mail.com',
  expiresAt: moment()
    .add(CONSTANTS.CONTACT_VERIFICATION_EXPIRY_HOURS, 'hours')
    .toDate(),
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export async function seed(knex: Knex): Promise<void> {
  await knex('contact_verifications').del();
  await knex('users').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(johnData),
    CaseConverter.objectKeysCamelToSnake(manuelData),
  ]);
  await knex('contact_verifications').insert([
    CaseConverter.objectKeysCamelToSnake(johnContactVerification),
    CaseConverter.objectKeysCamelToSnake(expiredJohnContactVerification),
    CaseConverter.objectKeysCamelToSnake(johnContactVerificationInvalidEmail),
    CaseConverter.objectKeysCamelToSnake(manuelUsedContactVerification),
  ]);
}
