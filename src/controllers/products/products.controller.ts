import Koa from 'koa';

import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './products.types';

export class ProductsController {
  static async createProduct(ctx: Koa.Context, _next: Koa.Next) {
    const userId = ctx.state.user.id;
    const dto = ctx.request.body as CreateProductDto;

    const { id: productId } = await ProductsRepository.createOne(userId, dto);

    if (!productId) {
      throw new Error('Failed to create product');
    }

    ctx.status = 201;
    ctx.body = { id: productId };
  }
}
