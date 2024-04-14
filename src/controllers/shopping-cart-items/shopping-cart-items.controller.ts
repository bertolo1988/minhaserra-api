import Koa from 'koa';

export class ShoppingCartItemsController {
  static async createShoppingCartItem(ctx: Koa.Context, next: Koa.Next) {
    const { productId, quantity } = ctx.request.body;

    // decrease available quantity of product
    // create shopping cart item
    const shoppingCartItemId = 'shopping-cart-item-id';

    ctx.status = 201;
    ctx.body = { id: shoppingCartItemId };
  }
}
