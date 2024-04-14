import { HttpError } from './http-error.error';

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
    this.name = this.constructor.name;
  }

  static isConflictError(err: unknown): boolean {
    return (err as Error).constructor.name === ConflictError.name;
  }
}
