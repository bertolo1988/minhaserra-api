import { isString } from 'lodash';
import { validate, version } from 'uuid';

export default function isValidUUID(input: unknown): boolean {
  if (!isString(input)) {
    return false;
  }
  return validate(input as string) && version(input as string) === 4;
}
