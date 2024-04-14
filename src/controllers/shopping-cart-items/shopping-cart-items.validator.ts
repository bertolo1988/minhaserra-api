import Koa from 'koa';

import { ErrorObject, ValidateFunction } from 'ajv';
import { ajv } from '../../utils/ajv';

import { NotFoundError, ValidationError } from '../../types/errors';
import { ProductsRepository } from '../products/products.repository';
import {
  CreateShoppingCartItemDto,
  CreateShoppingCartItemDtoSchema,
} from './shopping-cart-items.types';

const createShoppingCartItemValidator: ValidateFunction =
  ajv.compile<CreateShoppingCartItemDto>(CreateShoppingCartItemDtoSchema);

export class ShoppingCartItemsValidator {
  static async validateCreateShoppingCartItem(
    ctx: Koa.Context,
    next: Koa.Next,
  ) {
    const isQueryStringValid = createShoppingCartItemValidator(
      ctx.request.body,
    );
    if (!isQueryStringValid)
      throw new ValidationError(
        createShoppingCartItemValidator.errors as ErrorObject[],
      );
    await next();
  }
}
