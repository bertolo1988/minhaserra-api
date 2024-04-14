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

  static async validateProductCanBeBought(ctx: Koa.Context, next: Koa.Next) {
    const { productId } = ctx.request.body as CreateShoppingCartItemDto;

    const product = await ProductsRepository.getBuyableProductById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.availableQuantity < ctx.request.body.quantity) {
      throw new NotFoundError('Product is out of stock');
    }

    await next();
  }
}
