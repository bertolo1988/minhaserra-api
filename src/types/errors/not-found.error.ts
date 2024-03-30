import { HttpError } from './http-error.error';

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
    this.name = this.constructor.name;
  }

  static isNotFoundError(err: unknown): boolean {
    return (err as Error).constructor.name === NotFoundError.name;
  }
}
