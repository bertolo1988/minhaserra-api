import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import {
  CreateProductDto,
  CreateProductDtoSchema,
  ProductCategory,
  ProductSubCategory,
} from './products.types';

const createProductDtoValidator: ValidateFunction =
  ajv.compile<CreateProductDto>(CreateProductDtoSchema);

export class ProductsValidator {
  static isSubCategoryValidForCategory(
    category: string | ProductCategory,
    subCategory: string | ProductSubCategory,
  ): boolean {
    return subCategory.split('_')[0] === category;
  }

  static async validateCreateProduct(ctx: Koa.Context, next: Koa.Next) {
    const isBodyValid = createProductDtoValidator(ctx.request.body);
    if (!isBodyValid)
      throw new ValidationError(
        createProductDtoValidator.errors as ErrorObject[],
      );

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
}
