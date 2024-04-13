import Koa from 'koa';

export class ShoppingCartItemsValidator {
  static async validateCreateShoppingCartItem(
    ctx: Koa.Context,
    next: Koa.Next,
  ) {
    // TODO: Implement thiss
    await next();
  }

  static async validateProductIsForSale(ctx: Koa.Context, next: Koa.Next) {
    // TODO: Implement this
    // does product exist? is it approved, for sale and not soft deleted?
    await next();
  }
}
