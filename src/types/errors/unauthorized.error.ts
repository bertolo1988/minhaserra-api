import { HttpError } from './http-error.error';

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = this.constructor.name;
  }

  static isUnauthorizedError(err: unknown): boolean {
    return (err as any).constructor.name === UnauthorizedError.name;
  }
}
