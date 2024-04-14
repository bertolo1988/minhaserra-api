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

export const verifiedSeller2: UserModel = SeedUtils.getVerifiedUser(
  '5dff35b7-bba1-4c15-b4b4-f511c1a4b028',
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

export const verifiedSellerProduct1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '537fd072-890b-46e2-88f6-21231acf65e0',
    name: 'Mel de sargaço',
    userId: verifiedSeller.id,
  });

export const verifiedSellerProduct2: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '99065d5f-4e9f-4d14-9462-3eb90ec0f1c7',
    name: 'Mel de abelha',
    userId: verifiedSeller.id,
  });

export const verifiedSellerNoProductsProduct1: Omit<
  ProductModel,
  'searchDocument'
> = SeedUtils.getProduct({
  id: '53bad12c-99fa-4f9f-992d-1c91db0002d8',
  userId: verifiedSellerNoProducts.id,
  softDeleted: true,
});

export const verifiedSeller2NotForSaleProduct: Omit<
  ProductModel,
  'searchDocument'
> = SeedUtils.getProduct({
  id: '7359c573-4cd0-405d-909c-6c2e1d587b07',
  userId: verifiedSeller2.id,
  isOnSale: false,
});

export const verifiedSeller2NonApprovedProduct: Omit<
  ProductModel,
  'searchDocument'
> = SeedUtils.getProduct({
  id: '60b31145-ef7e-4f15-9a32-17460e4c8662',
  userId: verifiedSeller2.id,
  isApproved: false,
});

export const inactiveUser: UserModel = SeedUtils.getInactiveUser();
export const softDeletedUser: UserModel = SeedUtils.getSoftDeletedUser();
export const unverifiedUser: UserModel = SeedUtils.getNonVerifiedUser();

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('products').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2),
    CaseConverter.objectKeysCamelToSnake(verifiedBuyer),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
    CaseConverter.objectKeysCamelToSnake(unverifiedUser),
    CaseConverter.objectKeysCamelToSnake(verifiedSellerNoProducts),
  ]);
  await knex('products').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSellerProduct1),
    CaseConverter.objectKeysCamelToSnake(verifiedSellerProduct2),
    CaseConverter.objectKeysCamelToSnake(verifiedSellerNoProductsProduct1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2NotForSaleProduct),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2NonApprovedProduct),
  ]);
}
