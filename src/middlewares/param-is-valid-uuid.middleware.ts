import Koa from 'koa';

import { ValidationError } from '../types/errors';
import isValidUUID from '../utils/is-valid-uuid';

export async function validateIdValidUuid(ctx: Koa.Context, next: Koa.Next) {
  return getUuidValidatorMiddleware('id')(ctx, next);
}

export function getUuidValidatorMiddleware(field: string): Koa.Middleware {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const param = ctx.params[field];
    if (!isValidUUID(param)) {
      throw new ValidationError(`Invalid url parameter '${field}': ${param}`);
    }
    await next();
  };
}
