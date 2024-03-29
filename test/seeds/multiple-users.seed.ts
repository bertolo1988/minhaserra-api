import dotenv from 'dotenv';
import { Knex } from 'knex';
import moment from 'moment';
dotenv.config();

import { AddressModel } from '../../src/controllers/addresses/addresses.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { SeedUtils } from '../seed-utils';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

const now = moment();

export const verifiedUserAdminPassword: string =
  SeedUtils.getVerifiedUserPassword();
export const verifiedUserAdmin: UserModel = SeedUtils.getVerifiedUser(
  '56718a04-225e-42ba-a3e6-947d02172940',
  UserRole.ADMIN,
);

export const verifiedUserModeratorPassword: string =
  SeedUtils.getVerifiedUserPassword();
export const verifiedUserModerator: UserModel = SeedUtils.getVerifiedUser(
  '5eb4212d-69f8-4dd4-94d8-4803e1f260e2',
  UserRole.MODERATOR,
);

const verifiedUserBuyerAddress1Id = '0081b414-5178-4a8a-a09f-92d0a0bb00fb';
export const verifiedUserBuyerPassword: string = '9awj26AyDB%';
export const verifiedUserBuyer: UserModel = {
  id: 'dbd2199f-fda4-42dc-b2d4-c73051abd786',
  email: 'verified-user-buyer1@minhaserra.com',
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
  invoiceName: 'Google LLC',
  invoiceTaxNumber: 'PT515111118',
  invoiceAddressId: verifiedUserBuyerAddress1Id,
  shippingAddressId: verifiedUserBuyerAddress1Id,
  createdAt: now.toDate(),
  updatedAt: now.toDate(),
};

export const verifiedUserBuyerAddress1: AddressModel = SeedUtils.getUserAddress(
  verifiedUserBuyerAddress1Id,
  verifiedUserBuyer,
);

export const verifiedUserSellerPassword: string =
  SeedUtils.getVerifiedUserPassword();
export const verifiedUserSeller: UserModel = SeedUtils.getVerifiedUser(
  '158eeb55-f52b-47a5-b3d9-67946980fced',
  UserRole.SELLER,
);

export const inactiveUserPassword: string = SeedUtils.getInactiveUserPassword();
export const inactiveUser: UserModel = SeedUtils.getInactiveUser();

export const softDeletedUserPassword: string =
  SeedUtils.getSoftDeletedUserPassword();
export const softDeletedUser: UserModel = SeedUtils.getSoftDeletedUser();

export const unverifiedUserPassword: string =
  SeedUtils.getNonVerifiedUserPassword();
export const unverifiedUser: UserModel = SeedUtils.getNonVerifiedUser();

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('addresses').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedUserAdmin),
    CaseConverter.objectKeysCamelToSnake(verifiedUserModerator),
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyer),
    CaseConverter.objectKeysCamelToSnake(verifiedUserSeller),
    CaseConverter.objectKeysCamelToSnake(unverifiedUser),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
  ]);
  await knex('addresses').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedUserBuyerAddress1),
  ]);
}
