import { HttpError } from './http-error.error';

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = this.constructor.name;
  }

  static isForbiddenError(err: unknown): boolean {
    return (err as any).constructor.name === ForbiddenError.name;
  }
}
