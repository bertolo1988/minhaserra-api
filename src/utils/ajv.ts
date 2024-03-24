import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';

import { isValidIso3166Alpha2Code } from './other-utils';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
ajvFormats(ajv);

enum AjvCustomFormats {
  PASSWORD = 'password',
  COUNTRY_CODE = 'country-code',
  ONLY_LETTERS = 'only-letters',
  NUMBERS_LETTERS_UNDERSCORE_DASH = 'numbers-letters-underscore-dash',
}

/*
The regular expression you provided is used to validate a string with specific requirements. Here's what this regular expression means:
^ asserts start of a line
(?=.*[a-z]) ensures there is at least one lowercase letter
(?=.*[A-Z]) ensures there is at least one uppercase letter
(?=.*\d) ensures there is at least one digit
(?=.*[@$€£§!%*?&#<>«»=+_]) ensures there is at least one special character from the set @$€£§!%*?&#<>«»=+_
[A-Za-z\d@$€£§!%*?&#<>«»=+_]{8,}$ ensures the total string length is at least 8 characters and only contains the specified types of characters
So, this regular expression can be used to validate a password or any string that must contain at least one lowercase letter, one uppercase letter, one digit, one special character from the specified set, and must be at least 8 characters in length.
*/
ajv.addFormat(
  AjvCustomFormats.PASSWORD,
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$€£§!%*?&#<>«»=+_])[A-Za-z\d@$€£§!%*?&#<>«»=+_]{8,}$/,
);

ajv.addFormat(AjvCustomFormats.COUNTRY_CODE, {
  type: 'string',
  validate: isValidIso3166Alpha2Code,
});

ajv.addFormat(
  AjvCustomFormats.NUMBERS_LETTERS_UNDERSCORE_DASH,
  /^[A-Za-z0-9_-]+$/,
);

ajv.addFormat(AjvCustomFormats.ONLY_LETTERS, /^[A-Za-z]+$/);

export { ajv, AjvCustomFormats };
