import Koa from 'koa';

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../types/errors';

function safeSerialize(input: unknown | Error): string {
  const computedMessage =
    input != null && (input as Error).message != null
      ? (input as Error).message
      : '-';
  const computedStack =
    input != null && (input as Error).stack != null
      ? (input as Error).stack
      : '-';
  try {
    return `message:"${computedMessage}" stack:"${computedStack}" serialization:"${JSON.stringify(input, null, 2)}"`;
  } catch (err: unknown) {
    return `Failed error serialization! message:"${(err as Error).message}" stack:"${(err as Error).stack}"`;
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
        return;
      }

      if (ForbiddenError.isForbiddenError(err)) {
        const forbiddenError: ForbiddenError = err as ForbiddenError;
        ctx.status = forbiddenError.statusCode;
        ctx.body = {
          message: forbiddenError.message,
        };
        return;
      }

      if (UnauthorizedError.isUnauthorizedError(err)) {
        const unauthorizedError: UnauthorizedError = err as UnauthorizedError;
        ctx.status = unauthorizedError.statusCode;
        ctx.body = {
          message: unauthorizedError.message,
        };
        return;
      }

      if (NotFoundError.isNotFoundError(err)) {
        const notFoundError: NotFoundError = err as NotFoundError;
        ctx.status = notFoundError.statusCode;
        ctx.body = {
          message: notFoundError.message,
        };
        return;
      }

      if (ConflictError.isConflictError(err)) {
        const conflictError: ConflictError = err as ConflictError;
        ctx.status = conflictError.statusCode;
        ctx.body = {
          message: conflictError.message,
        };
        return;
      }
    }
  }
}
