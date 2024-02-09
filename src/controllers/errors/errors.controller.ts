import Koa from 'koa';

function isValidationError(err: any) {
  return err.statusCode === 400 && err.validationErrors != null;
}

function safeSerialize(input: unknown | Error | any) {
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
    } catch (err: any) {
      console.error(`Error caught! Error:\"${safeSerialize(err)}\"`);

      ctx.status = 500;
      ctx.body = { message: 'Server error' };

      if (isValidationError(err)) {
        ctx.status = err.statusCode;
        ctx.body = { message: err.message, errors: err.validationErrors };
      }
    }
  }
}
