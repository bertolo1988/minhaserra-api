import Koa from 'koa';

import { ValidationError } from '../types/errors';
import { isNumericString } from '../utils/is-numeric-string';
import CONSTANTS from '../constants';

export async function validatePaginationParams(
  ctx: Koa.Context,
  next: Koa.Next,
) {
  const { offset, limit } = ctx.request.query;

  if (offset != null && !isNumericString(offset)) {
    throw new ValidationError(`Invalid query parameter 'offset'`);
  }

  if (limit != null && !isNumericString(limit)) {
    throw new ValidationError(`Invalid query parameter 'limit'`);
  }

  if (parseInt(limit as string) > CONSTANTS.MAX_PAGINATION_LIMIT) {
    throw new ValidationError(
      `'limit' must be less than ${CONSTANTS.MAX_PAGINATION_LIMIT}`,
    );
  }

  if (parseInt(limit as string) % 5 !== 0) {
    throw new ValidationError(`'limit' must be multiple of 5`);
  }

  if (parseInt(offset as string) % 5 !== 0) {
    throw new ValidationError(`'offset' must be multiple of 5`);
  }

  await next();
}
