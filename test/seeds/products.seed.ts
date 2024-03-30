import dotenv from 'dotenv';
import { Knex } from 'knex';
dotenv.config();

import { ProductModel } from '../../src/controllers/products/products.types';
import { UserModel, UserRole } from '../../src/controllers/users/users.types';
import { CaseConverter } from '../../src/utils/case-converter';
import { SeedUtils } from '../seed-utils';
import { isProduction } from '../test-utils';

if (isProduction()) {
  throw new Error('Cannot truncate tables in production environment!');
}

export const verifiedSeller: UserModel = SeedUtils.getVerifiedUser(
  '760f0154-cbd1-447c-a875-9b58cda6bc72',
  UserRole.SELLER,
);

export const verifiedSellerNoProducts: UserModel = SeedUtils.getVerifiedUser(
  '2e3cdbcb-5231-441c-9a6b-760eb504f500',
  UserRole.SELLER,
);

export const verifiedBuyer: UserModel = SeedUtils.getVerifiedUser(
  'a9ef0273-3a5d-40a0-ae63-0c075a18c10c',
  UserRole.BUYER,
);

export const verifiedSellerProduct1: ProductModel = SeedUtils.getProduct(
  '537fd072-890b-46e2-88f6-21231acf65e0',
  verifiedSeller.id,
);

export const verifiedSellerProduct2: ProductModel = SeedUtils.getProduct(
  '99065d5f-4e9f-4d14-9462-3eb90ec0f1c7',
  verifiedSeller.id,
);

export const verifiedSellerSoftDeletedProduct: ProductModel =
  SeedUtils.getProduct(
    '7f11e4f9-3f93-48bc-b27f-2e192af7748c',
    verifiedSeller.id,
    true,
  );

export const inactiveUser: UserModel = SeedUtils.getInactiveUser();
export const softDeletedUser: UserModel = SeedUtils.getSoftDeletedUser();
export const unverifiedUser: UserModel = SeedUtils.getNonVerifiedUser();

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('products').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller),
    CaseConverter.objectKeysCamelToSnake(verifiedBuyer),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
    CaseConverter.objectKeysCamelToSnake(unverifiedUser),
    CaseConverter.objectKeysCamelToSnake(verifiedSellerNoProducts),
  ]);
  await knex('products').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSellerProduct1),
    CaseConverter.objectKeysCamelToSnake(verifiedSellerSoftDeletedProduct),
    CaseConverter.objectKeysCamelToSnake(verifiedSellerProduct2),
  ]);
}
