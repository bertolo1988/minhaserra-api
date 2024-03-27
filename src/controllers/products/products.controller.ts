import Koa from 'koa';

export class ProductsController {
  static async createProduct(ctx: Koa.Context, next: Koa.Next) {
    ctx.status = 201;
    ctx.body = { id: '123' };
  }
}
