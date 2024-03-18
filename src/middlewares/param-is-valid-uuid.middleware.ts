import Koa from 'koa';
import { ValidationError } from '../types/errors';
import isValidUUID from '../utils/is-valid-uuid';

export async function validateIdValidUuid(ctx: Koa.Context, next: Koa.Next) {
  const { id } = ctx.params;
  if (!isValidUUID(id)) {
    throw new ValidationError(`Invalid id: ${id}`);
  }
  await next();
}
