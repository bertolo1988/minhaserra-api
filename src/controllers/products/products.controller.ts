import Koa from 'koa';

import { isUpdateSuccessfull } from '../../knex-database';
import { TranslationService } from '../../services/translation-service';
import { Language, PaginationParams } from '../../types';
import { ProductsMapper } from './products.mapper';
import { ProductsRepository } from './products.repository';
import {
  CreateProductDto,
  ProductModel,
  UpdateProductDto,
} from './products.types';
import { ProductsValidator } from './products.validator';

const translationService = new TranslationService();

export class ProductsController {
  static async getProducts(ctx: Koa.Context, _next: Koa.Next) {
    const paginationParams = new PaginationParams(
      ctx.request.query.offset as string,
      ctx.request.query.limit as string,
    );

    // TODO: implement this

    ctx.status = 200;
    ctx.body = [];
  }

  static async updateProductById(ctx: Koa.Context, _next: Koa.Next) {
    const userId: string = ctx.state.user.id;
    const productId: string = ctx.params.id;
    const dto: UpdateProductDto = ctx.request.body as UpdateProductDto;

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

    if (dto.subCategory != null || dto.category != null) {
      const eligibleCategory =
        dto.category != null ? dto.category : product.category;
      const eligibleSubCategory =
        dto.subCategory != null ? dto.subCategory : product.subCategory;
      if (
        !ProductsValidator.isSubCategoryValidForCategory(
          eligibleCategory,
          eligibleSubCategory,
        )
      ) {
        ctx.status = 400;
        ctx.body = {
          message: `'${eligibleSubCategory}' is not a valid sub category of category '${eligibleCategory}'`,
        };
        return;
      }
    }

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
    ctx.body = products.map(ProductsMapper.mapProductModeltoOwnerProductModel);
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

    ctx.status = 200;
    ctx.body = ProductsMapper.mapProductModeltoOwnerProductModel(product);
  }

  static async createProduct(ctx: Koa.Context, _next: Koa.Next) {
    const userId = ctx.state.user.id;
    let dto = ctx.request.body as CreateProductDto;

    const nameEnglish = await translationService.translate(
      dto.name,
      dto.language,
      Language.ENGLISH,
    );
    const descriptionEnglish = await translationService.translate(
      dto.description,
      dto.language,
      Language.ENGLISH,
    );

    const { id: productId } = await ProductsRepository.createOne(userId, {
      ...dto,
      nameEnglish,
      descriptionEnglish,
    });

    if (!productId) {
      throw new Error('Failed to create product');
    }

    ctx.status = 201;
    ctx.body = { id: productId };
  }
}
