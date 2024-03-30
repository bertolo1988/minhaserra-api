import Koa from 'koa';

import { ValidationError } from '../types/errors';
import { isNumericString } from '../utils/is-numeric-string';

export async function validatePaginationParams(
  ctx: Koa.Context,
  next: Koa.Next,
) {
  const { offset, limit } = ctx.request.query;

  if (offset && !isNumericString(offset)) {
    throw new ValidationError(`Invalid query parameter 'offset'`);
  }

  if (limit && !isNumericString(limit)) {
    throw new ValidationError(`Invalid query parameter 'limit'`);
  }

  await next();
}
