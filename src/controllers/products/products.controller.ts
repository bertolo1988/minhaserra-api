import Koa from 'koa';

export class ProductsController {
  static async createProductImage(ctx: Koa.Context, next: Koa.Next) {
    const body = ctx.request.body;
    console.log(1, body);
    const files = ctx.request.files;
    console.log(2, files);
    return next();
  }
}
