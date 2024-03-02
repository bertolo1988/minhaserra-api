import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import {
  PasswordResetDto,
  PasswordResetDtoSchema,
} from './password-resets.types';

const passwordResetValidator: ValidateFunction = ajv.compile<PasswordResetDto>(
  PasswordResetDtoSchema,
);

export class PasswordResetsValidator {
  static async validateCreatePasswordReset(ctx: Koa.Context, next: Koa.Next) {
    const valid = passwordResetValidator(ctx.request.body);
    if (!valid)
      throw new ValidationError(passwordResetValidator.errors as ErrorObject[]);
    await next();
  }
}
