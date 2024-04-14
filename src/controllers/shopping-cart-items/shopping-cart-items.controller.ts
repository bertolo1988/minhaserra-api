import Koa from 'koa';

import { NotFoundError } from '../../types/errors';
import { ProductsRepository } from '../products/products.repository';
import { ShoppingCartItemsRepository } from './shopping-cart-items.repository';
import { CreateShoppingCartItemDto } from './shopping-cart-items.types';

export class ShoppingCartItemsController {
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
