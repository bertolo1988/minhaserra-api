import Koa from 'koa';

import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './products.types';
import { ProductsMapper } from './products.mapper';

export class ProductsController {
  static async getProductById(ctx: Koa.Context, _next: Koa.Next) {
    const { id } = ctx.params;

    const product = await ProductsRepository.getProductById(id);
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    } else {
      ctx.status = 200;
      ctx.body = ProductsMapper.mapProductModeltoPublicProductModel(product);
    }
  }

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
