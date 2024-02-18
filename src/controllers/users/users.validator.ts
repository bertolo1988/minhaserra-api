import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';

import { ValidationError } from '../../types/errors';
import { UserDto, UserDtoSchema } from './users.types';

const ajv = new Ajv();
const createUserValidator: ValidateFunction =
  ajv.compile<UserDto>(UserDtoSchema);

export class UsersValidator {
  static async validateCreateUser(ctx: Koa.Context, next: Koa.Next) {
    const valid = createUserValidator(ctx.request.body);
    if (!valid)
      throw new ValidationError(createUserValidator.errors as ErrorObject[]);
    await next();
  }
}
