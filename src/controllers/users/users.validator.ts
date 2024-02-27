import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import {
  LoginDto,
  LoginDtoSchema,
  UserDto,
  UserDtoSchema,
} from './users.types';

const createUserValidator: ValidateFunction =
  ajv.compile<UserDto>(UserDtoSchema);

const loginUserValidator: ValidateFunction =
  ajv.compile<LoginDto>(LoginDtoSchema);

export class UsersValidator {
  static async validateCreateUser(ctx: Koa.Context, next: Koa.Next) {
    const valid = createUserValidator(ctx.request.body);
    if (!valid)
      throw new ValidationError(createUserValidator.errors as ErrorObject[]);
    await next();
  }

  static async validateLoginUser(ctx: Koa.Context, next: Koa.Next) {
    const valid = loginUserValidator(ctx.request.body);
    if (!valid)
      throw new ValidationError(loginUserValidator.errors as ErrorObject[]);
    await next();
  }
}
