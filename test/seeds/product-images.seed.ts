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

export const verifiedSeller1: UserModel = SeedUtils.getVerifiedUser(
  '760f0154-cbd1-447c-a875-9b58cda6bc72',
  UserRole.SELLER,
);
export const verifiedSeller2: UserModel = SeedUtils.getVerifiedUser(
  '891a694a-7e76-41e7-af5f-349eba16d124',
  UserRole.SELLER,
);

export const verifiedSeller1Product1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '69fd8a15-23ff-4485-a979-557b2eddeec1',
    userId: verifiedSeller1.id,
  });

export const verifiedSeller1SoftDeleteProduct2: Omit<
  ProductModel,
  'searchDocument'
> = SeedUtils.getProduct({
  id: '229f9e6d-6714-4bf9-b1ba-fae606b584d6',
  userId: verifiedSeller1.id,
  softDeleted: true,
});

export const verifiedSeller2Product1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: 'b9623a42-6321-49fd-aac6-db21b6fe8cb1',
    userId: verifiedSeller2.id,
  });

export const verifiedSeller2Product1Images = [
  SeedUtils.getProductImage(
    '11fe0866-e999-41c4-be82-421f54fc9952',
    verifiedSeller2Product1.id,
  ),
  SeedUtils.getProductImage(
    '21fe0866-e999-41c4-be82-421f54fc9952',
    verifiedSeller2Product1.id,
  ),
  SeedUtils.getProductImage(
    '31fe0866-e999-41c4-be82-421f54fc9952',
    verifiedSeller2Product1.id,
  ),
  SeedUtils.getProductImage(
    '41fe0866-e999-41c4-be82-421f54fc9952',
    verifiedSeller2Product1.id,
  ),
  SeedUtils.getProductImage(
    '51fe0866-e999-41c4-be82-421f54fc9952',
    verifiedSeller2Product1.id,
  ),
  SeedUtils.getProductImage(
    '61fe0866-e999-41c4-be82-421f54fc9952',
    verifiedSeller2Product1.id,
  ),
  SeedUtils.getProductImage(
    '71fe0866-e999-41c4-be82-421f54fc9952',
    verifiedSeller2Product1.id,
  ),
];

export const inactiveUser: UserModel = SeedUtils.getInactiveUser();
export const softDeletedUser: UserModel = SeedUtils.getSoftDeletedUser();
export const unverifiedUser: UserModel = SeedUtils.getNonVerifiedUser();

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('products').del();
  await knex('product_images').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2),
    CaseConverter.objectKeysCamelToSnake(inactiveUser),
    CaseConverter.objectKeysCamelToSnake(softDeletedUser),
    CaseConverter.objectKeysCamelToSnake(unverifiedUser),
  ]);
  await knex('products').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product1),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1SoftDeleteProduct2),
    CaseConverter.objectKeysCamelToSnake(verifiedSeller2Product1),
  ]);
  await knex('product_images').insert(
    verifiedSeller2Product1Images.map((i) =>
      CaseConverter.objectKeysCamelToSnake(i),
    ),
  );
}
