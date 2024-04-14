import Koa from 'koa';
import { NotFoundError } from '../../types/errors';
import { ProductsRepository } from '../products/products.repository';
import { CreateShoppingCartItemDto } from './shopping-cart-items.types';
import { isUpdateSuccessfull } from '../../knex-database';

export class ShoppingCartItemsController {
  static async createShoppingCartItem(ctx: Koa.Context, next: Koa.Next) {
    const { productId, quantity } = ctx.request
      .body as CreateShoppingCartItemDto;

    const product = await ProductsRepository.getBuyableProductById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.availableQuantity < quantity) {
      throw new NotFoundError('Product is out of stock');
    }

    // TODO continue here
    const updateResult = await ProductsRepository.updateProductQuantity(
      product.availableQuantity - quantity,
    );
    if (!isUpdateSuccessfull(updateResult)) {
      throw new Error('Failed to update product quantity');
    }

    const { id: shoppingCartItemId } =
      await ShoppingCartItemsRepository.createShoppingCartItem();

    ctx.status = 201;
    ctx.body = { id: shoppingCartItemId };
  }
}
