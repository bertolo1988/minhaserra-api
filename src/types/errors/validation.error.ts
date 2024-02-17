import { ErrorObject } from 'ajv';
import { HttpError } from './http-error.error';

export class ValidationError extends HttpError {
  validationErrors: ErrorObject[];

  constructor(errors: ErrorObject[]) {
    super(400, `Validation error`);
    this.name = this.constructor.name;
    this.validationErrors = errors;
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    // Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }

  getFirstErrorMessage(): string | undefined {
    return this.validationErrors[0].message;
  }

  static isValidationError(err: unknown): boolean {
    return (err as any).constructor.name === ValidationError.name;
  }
}
