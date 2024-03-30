import Koa from 'koa';

import { isUpdateSuccessfull } from '../../knex-database';
import { ProductsMapper } from './products.mapper';
import { ProductsRepository } from './products.repository';
import {
  CreateProductDto,
  ProductModel,
  UpdateProductDto,
} from './products.types';

export class ProductsController {
  static async updateProductById(ctx: Koa.Context, _next: Koa.Next) {
    const userId: string = ctx.state.user.id;
    const productId: string = ctx.params.id;
    const dto: UpdateProductDto = ctx.request.body as UpdateProductDto;

    const updateResult = await ProductsRepository.updateProductByIdAndUserId(
      userId,
      productId,
      dto,
    );

    if (isUpdateSuccessfull(updateResult) === false) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    } else {
      ctx.status = 200;
      ctx.body = { message: 'Product updated' };
    }
  }

  static async getProductsForUser(ctx: Koa.Context, _next: Koa.Next) {
    const userId: string = ctx.state.user.id;

    const products: ProductModel[] =
      await ProductsRepository.getProductsByUserId(userId);

    ctx.status = 200;
    ctx.body = products.map(ProductsMapper.mapProductModeltoPublicProductModel);
  }

  static async deleteProductById(ctx: Koa.Context, _next: Koa.Next) {
    const productId: string = ctx.params.id;
    const userId: string = ctx.state.user.id;

    const product = await ProductsRepository.getProductById(productId);

    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    }

    if (product.userId !== userId) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden' };
      return;
    }

    const deleteResult: { id: string; is_deleted: boolean }[] =
      await ProductsRepository.softDeleteProductByIdAndUserId(
        userId,
        productId,
      );

    if (isUpdateSuccessfull(deleteResult) === false) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    } else {
      ctx.status = 200;
      ctx.body = { message: 'Product deleted' };
    }
  }

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
