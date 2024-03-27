import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import { CreateProductDto, CreateProductDtoSchema } from './products.types';

const createProductDtoValidator: ValidateFunction =
  ajv.compile<CreateProductDto>(CreateProductDtoSchema);

export class ProductsValidator {
  static async validateCreateProduct(ctx: Koa.Context, next: Koa.Next) {
    const validBody = createProductDtoValidator(ctx.request.body);
    if (!validBody)
      throw new ValidationError(
        createProductDtoValidator.errors as ErrorObject[],
      );
    await next();
  }
}
