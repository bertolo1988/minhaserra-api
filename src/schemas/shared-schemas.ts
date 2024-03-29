import { Schema } from 'ajv';

import { AjvCustomFormats } from '../utils/ajv';

export const BirthDateSchema: Schema = {
  type: 'string',
  nullable: true,
  format: 'date',
  errorMessage: `'birthDate' must be a valid date in format YYYY-MM-DD`,
};

export const CountryCodeSchema: Schema = {
  type: 'string',
  format: AjvCustomFormats.COUNTRY_CODE,
  nullable: false,
  maxLength: 2,
  errorMessage: `'countryCode' must have two characters and be valid according to ISO 3166-1 alpha-2`,
};

export const PasswordSchema: Schema = {
  type: 'string',
  nullable: false,
  minLength: 8,
  maxLength: 64,
  format: AjvCustomFormats.PASSWORD,
  errorMessage: `'password' must be have at least 8 characters and at most 64 characters, and must contain at least one uppercase letter, one lowercase letter, one digit, and one special character`,
};
