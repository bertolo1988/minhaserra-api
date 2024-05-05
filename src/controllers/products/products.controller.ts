import Koa from 'koa';
import _ from 'lodash';

import { isUpdateSuccessfull } from '../../knex-database';
import { TranslationService } from '../../services/translation-service';
import { PaginationParams } from '../../types';
import { isNonEmptyString } from '../../utils/other-utils';
import { ProductsMapper } from './products.mapper';
import { ProductsRepository } from './products.repository';
import {
  CreateProductDto,
  ProductModel,
  ProductsSearchDto,
  PublicProductModel,
  UpdateProductDto,
} from './products.types';
import { ProductsValidator } from './products.validator';

const translationService = new TranslationService();

export class ProductsController {
  static async getProducts(ctx: Koa.Context, _next: Koa.Next) {
    const searchParameters = _.omit(ctx.request.query, [
      'offset',
      'limit',
      'text',
    ]) as ProductsSearchDto;

    if (isNonEmptyString(ctx.request.query.text)) {
      searchParameters.text = await translationService.translateToEnglishAuto(
        ctx.request.query.text as string,
      );
      console.log(
        `Translation request - text:${ctx.request.query.text} translated:${searchParameters.text}`,
      );
    }

    const paginationParams = new PaginationParams(
      ctx.request.query.offset as string,
      ctx.request.query.limit as string,
    );

    const products: PublicProductModel[] =
      await ProductsRepository.searchProducts(
        searchParameters,
        paginationParams,
      );

    ctx.status = 200;
    ctx.body = products;
  }

  static async updateProductById(ctx: Koa.Context, _next: Koa.Next) {
    let nameEnglish: string = '';
    let descriptionEnglish: string = '';
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

    if (dto.name != null) {
      nameEnglish = await translationService.translateToEnglish(
        dto.name,
        product.language,
      );
    }

    if (dto.description != null) {
      descriptionEnglish = await translationService.translateToEnglish(
        dto.description,
        product.language,
      );
    }

    const updateResult = await ProductsRepository.updateProductByIdAndUserId(
      userId,
      productId,
      { ...dto, descriptionEnglish, nameEnglish },
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

  static async getPublicProductById(ctx: Koa.Context, _next: Koa.Next) {
    const productId: string = ctx.params.id;

    const product = await ProductsRepository.getPublicProductById(productId);

    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = product;
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
    const dto = ctx.request.body as CreateProductDto;

    const nameEnglish = await translationService.translateToEnglish(
      dto.name,
      dto.language,
    );
    const descriptionEnglish = await translationService.translateToEnglish(
      dto.description,
      dto.language,
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
