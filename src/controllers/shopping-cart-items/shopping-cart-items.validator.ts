import Koa from 'koa';
import { ErrorObject, ValidateFunction } from 'ajv';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
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
