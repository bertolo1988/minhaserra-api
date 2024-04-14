import Koa from 'koa';

import { isDeleteSuccessfull } from '../../knex-database';
import { NotFoundError } from '../../types/errors';
import { ProductsRepository } from '../products/products.repository';
import { ShoppingCartItemsRepository } from './shopping-cart-items.repository';
import { CreateShoppingCartItemDto } from './shopping-cart-items.types';

export class ShoppingCartItemsController {
  static async deleteShoppingCartItemById(ctx: Koa.Context, _next: Koa.Next) {
    const userId = ctx.state.user.id;
    const shoppingCartItemId = ctx.params.id;

    const deleteResult = await ShoppingCartItemsRepository.deleteOne(
      userId,
      shoppingCartItemId,
    );

    if (isDeleteSuccessfull(deleteResult)) {
      ctx.status = 200;
      ctx.body = { message: 'Item deleted successfully' };
    } else {
      ctx.status = 404;
      ctx.body = { message: 'Item not found' };
    }
  }

  static async getShoppingCartItemsForUser(ctx: Koa.Context, _next: Koa.Next) {
    const userId = ctx.state.user.id;

    const shoppingCartItems =
      await ShoppingCartItemsRepository.getShoppingCartItemsByUserId(userId);

    ctx.status = 200;
    ctx.body = shoppingCartItems;
  }

  static async createShoppingCartItem(ctx: Koa.Context, _next: Koa.Next) {
    const userId = ctx.state.user.id;
    const dto = ctx.request.body as CreateShoppingCartItemDto;

    const product = await ProductsRepository.getBuyableProductById(
      dto.productId,
    );

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.availableQuantity < dto.quantity) {
      throw new NotFoundError('Product is out of stock');
    }

    const { id: shoppingCartItemId } =
      await ShoppingCartItemsRepository.createOne(userId, dto);

    ctx.status = 201;
    ctx.body = { id: shoppingCartItemId };
  }
}
