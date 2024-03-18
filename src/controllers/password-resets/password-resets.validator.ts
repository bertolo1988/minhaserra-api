import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';

import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import {
  PasswordResetDto,
  PasswordResetDtoSchema,
  UpdatePasswordUnauthenticatedDto,
  UpdatePasswordUnauthenticatedDtoSchema,
} from './password-resets.types';

const passwordResetValidator: ValidateFunction = ajv.compile<PasswordResetDto>(
  PasswordResetDtoSchema,
);

const updatePasswordUnauthenticatedValidator: ValidateFunction =
  ajv.compile<UpdatePasswordUnauthenticatedDto>(
    UpdatePasswordUnauthenticatedDtoSchema,
  );

export class PasswordResetsValidator {
  static async validateCreatePasswordReset(ctx: Koa.Context, next: Koa.Next) {
    const validBody = passwordResetValidator(ctx.request.body);
    if (!validBody)
      throw new ValidationError(passwordResetValidator.errors as ErrorObject[]);
    await next();
  }

  static async validateUpdatePasswordUnauthenticated(
    ctx: Koa.Context,
    next: Koa.Next,
  ) {
    const validBody = updatePasswordUnauthenticatedValidator(ctx.request.body);
    if (!validBody)
      throw new ValidationError(
        updatePasswordUnauthenticatedValidator.errors as ErrorObject[],
      );
    await next();
  }
}
