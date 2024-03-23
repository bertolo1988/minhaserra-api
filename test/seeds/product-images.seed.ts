import dotenv from 'dotenv';
dotenv.config();

import { Knex } from 'knex';
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

export const verifiedSellerProduct1: ProductModel = SeedUtils.getProduct(
  verifiedSeller.id,
  '537fd072-890b-46e2-88f6-21231acf65e0',
);

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('products').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller),
  ]);
  await knex('products').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSellerProduct1),
  ]);
}
