import Koa from 'koa';

import { ValidationError } from '../../types/errors';

function safeSerialize(input: unknown | Error | any): string {
  try {
    return JSON.stringify(input, null, 2);
  } catch (err: any) {
    return `Failed error serialization! message:\"${err.message}\" stack:\"${err.stack}\"`;
  }
}

export class ErrorsController {
  static async handleError(ctx: Koa.Context, next: Koa.Next) {
    try {
      await next();
    } catch (err: unknown) {
      console.error(`Error caught! Error:"${safeSerialize(err)}"`);

      ctx.status = 500;
      ctx.body = { message: 'Server error' };

      if (ValidationError.isValidationError(err)) {
        const validationError: ValidationError = err as ValidationError;
        ctx.status = validationError.statusCode;
        ctx.body = {
          message: validationError.getFirstErrorMessage(),
        };
      }
    }
  }
}
