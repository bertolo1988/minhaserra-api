import Koa from 'koa';
import { ErrorObject, ValidateFunction } from 'ajv';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import {
  CreateShoppingCartItemDto,
  CreateShoppingCartItemDtoSchema,
  PatchShoppingCartItemQuantityDto,
  PatchShoppingCartItemQuantitySchema,
} from './shopping-cart-items.types';

const createShoppingCartItemValidator: ValidateFunction =
  ajv.compile<CreateShoppingCartItemDto>(CreateShoppingCartItemDtoSchema);

const patchShoppingCartItemQuantityValidator: ValidateFunction =
  ajv.compile<PatchShoppingCartItemQuantityDto>(
    PatchShoppingCartItemQuantitySchema,
  );

export class ShoppingCartItemsValidator {
  static async validatePatchShoppingCartItemQuantity(
    ctx: Koa.Context,
    next: Koa.Next,
  ) {
    const isQueryStringValid = patchShoppingCartItemQuantityValidator(
      ctx.request.body,
    );
    if (!isQueryStringValid)
      throw new ValidationError(
        patchShoppingCartItemQuantityValidator.errors as ErrorObject[],
      );
    await next();
  }

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
