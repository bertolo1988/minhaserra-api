import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';
import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import { CreateAddressDto, CreateAddressDtoSchema } from './addresses.types';
import isValidUUID from '../../utils/is-valid-uuid';

const createAddressDtoValidator: ValidateFunction =
  ajv.compile<CreateAddressDto>(CreateAddressDtoSchema);

export class AddressesValidator {
  static async validateCreateAddress(ctx: Koa.Context, next: Koa.Next) {
    const validBody = createAddressDtoValidator(ctx.request.body);
    if (!validBody)
      throw new ValidationError(
        createAddressDtoValidator.errors as ErrorObject[],
      );
    await next();
  }

  static async validateGetOneAddress(ctx: Koa.Context, next: Koa.Next) {
    const { id } = ctx.params;
    if (!isValidUUID(id)) {
      throw new ValidationError(`Invalid id: ${id}`);
    }
    await next();
  }
}
