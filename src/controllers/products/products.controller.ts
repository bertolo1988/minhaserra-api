import Koa from 'koa';

export class ProductsController {
  static async createProductImage(ctx: Koa.Context, next: Koa.Next) {
    return next();
  }
}
