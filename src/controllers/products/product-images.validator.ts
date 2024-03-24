import Koa from 'koa';
import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import { ErrorObject, ValidateFunction } from 'ajv';
import {
  CreateProductImageDto,
  CreateProductImageDtoSchema,
} from './products.types';

const createProductImageDtoValidator: ValidateFunction =
  ajv.compile<CreateProductImageDto>(CreateProductImageDtoSchema);

export class ProductImagesValidator {
  static async validateCreateProductImage(ctx: Koa.Context, next: Koa.Next) {
    const validBody = createProductImageDtoValidator(ctx.request.body);
    if (!validBody)
      throw new ValidationError(
        createProductImageDtoValidator.errors as ErrorObject[],
      );
    await next();
  }
}
