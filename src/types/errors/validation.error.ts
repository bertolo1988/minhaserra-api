import { ErrorObject } from 'ajv';
import { isString } from 'lodash';

import { HttpError } from './http-error.error';

export class ValidationError extends HttpError {
  validationErrors: ErrorObject[] | string | string[];

  constructor(errors: ErrorObject[] | string | string[]) {
    super(400, `Validation error`);
    this.name = this.constructor.name;
    this.validationErrors = errors;
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    // Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }

  getFirstErrorMessage(): string | undefined {
    if (isString(this.validationErrors)) {
      return this.validationErrors;
    } else if (isString(this.validationErrors[0])) {
      return this.validationErrors[0];
    } else {
      return (this.validationErrors[0] as ErrorObject).message;
    }
  }

  static isValidationError(err: unknown): boolean {
    return (err as Error).constructor.name === ValidationError.name;
  }
}
