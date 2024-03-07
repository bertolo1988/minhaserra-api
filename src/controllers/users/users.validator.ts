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
import isValidUUID from '../../utils/is-valid-uuid';

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

  static async validateGetUserById(ctx: Koa.Context, next: Koa.Next) {
    const { id } = ctx.params;
    if (!isValidUUID(id)) {
      throw new ValidationError(`Invalid id: ${id}`);
    }
    await next();
  }
}
