import iso3311a2 from 'iso-3166-1-alpha-2';
import _ from 'lodash';

export function sleep(ms = 1500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param code unknown
 * @returns true if the code is a valid ISO 3166-1 alpha-2 code
 */
export function isValidIso3166Alpha2Code(input: unknown): boolean {
  try {
    const country = iso3311a2.getCountry(input as string);
    return country != null && _.isString(country) && country.length > 0;
  } catch (err) {
    return false;
  }
}
