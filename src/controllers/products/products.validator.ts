import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import {
  CreateProductDto,
  CreateProductDtoSchema,
  ProductCategory,
  ProductSubCategory,
  ProductsSearchDto,
  ProductsSearchDtoSchema,
  UpdateProductDto,
  UpdateProductDtoSchema,
} from './products.types';

const createProductDtoValidator: ValidateFunction =
  ajv.compile<CreateProductDto>(CreateProductDtoSchema);

const updateProductDtoValidator: ValidateFunction =
  ajv.compile<UpdateProductDto>(UpdateProductDtoSchema);

const productSearchValidator: ValidateFunction = ajv.compile<ProductsSearchDto>(
  ProductsSearchDtoSchema,
);

export class ProductsValidator {
  static async validateProductsSearch(ctx: Koa.Context, next: Koa.Next) {
    const isBodyValid = productSearchValidator(ctx.request.body);
    if (!isBodyValid)
      throw new ValidationError(productSearchValidator.errors as ErrorObject[]);
    await next();
  }

  static async validateUpdateProduct(ctx: Koa.Context, next: Koa.Next) {
    const isBodyValid = updateProductDtoValidator(ctx.request.body);
    if (!isBodyValid)
      throw new ValidationError(
        updateProductDtoValidator.errors as ErrorObject[],
      );
    await next();
  }

  static isSubCategoryValidForCategory(
    category: string | ProductCategory,
    subCategory: string | ProductSubCategory,
  ): boolean {
    return subCategory.split('_')[0] === category;
  }

  static async validateSubCategoryMatchesCategory(
    ctx: Koa.Context,
    next: Koa.Next,
  ) {
    const body: CreateProductDto = ctx.request.body;

    if (
      !ProductsValidator.isSubCategoryValidForCategory(
        body.category,
        body.subCategory,
      )
    )
      throw new ValidationError(
        `'${body.subCategory}' is not a valid sub category of category '${body.category}'`,
      );

    await next();
  }

  static async validateCreateProduct(ctx: Koa.Context, next: Koa.Next) {
    const isBodyValid = createProductDtoValidator(ctx.request.body);
    if (!isBodyValid)
      throw new ValidationError(
        createProductDtoValidator.errors as ErrorObject[],
      );

    await next();
  }
}
