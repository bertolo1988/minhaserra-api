import dotenv from 'dotenv';
import { Knex } from 'knex';
dotenv.config();

import { ProductModel } from '../../src/controllers/products/products.types';
import { ShoppingCartItemModel } from '../../src/controllers/shopping-cart-items/shopping-cart-items.types';
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

export const verifiedBuyer1: UserModel = SeedUtils.getVerifiedUser(
  'a9ef0273-3a5d-40a0-ae63-0c075a18c10c',
  UserRole.BUYER,
);

export const verifiedBuyerEmptyCart: UserModel = SeedUtils.getVerifiedUser(
  'eb8e71e1-1069-4d71-9b03-4c6fecbb993c',
  UserRole.BUYER,
);

export const verifiedSeller1Product1: Omit<ProductModel, 'searchDocument'> =
  SeedUtils.getProduct({
    id: '537fd072-890b-46e2-88f6-21231acf65e0',
    name: 'Mel de sargaço',
    userId: verifiedSeller1.id,
  });

export const verifiedBuyer1ShoppingCartItem1: ShoppingCartItemModel =
  SeedUtils.getShoppingCartItem({
    id: '5708833d-e5b0-4ff8-82ea-6e82013239dd',
    productId: verifiedSeller1Product1.id,
    userId: verifiedBuyer1.id,
  });

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  await knex('products').del();
  await knex('shopping_cart_items').del();

  await knex('users').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1),
    CaseConverter.objectKeysCamelToSnake(verifiedBuyer1),
    CaseConverter.objectKeysCamelToSnake(verifiedBuyerEmptyCart),
  ]);
  await knex('products').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedSeller1Product1),
  ]);
  await knex('shopping_cart_items').insert([
    CaseConverter.objectKeysCamelToSnake(verifiedBuyer1ShoppingCartItem1),
  ]);
}
