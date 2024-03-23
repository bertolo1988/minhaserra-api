import Koa from 'koa';

export class ProductsValidator {
  static validateCreateProductImage(ctx: Koa.Context, next: Koa.Next) {
    return next();
  }
}
