import { isValidIso3166Alpha2Code } from '../../src/utils/other-utils';

describe('isValidIso3166Alpha2Code', () => {
  describe('returns false', () => {
    test('when the input is a number', () => {
      const result = isValidIso3166Alpha2Code(333);
      expect(result).toBe(false);
    });

    test('when the input is null', () => {
      const result = isValidIso3166Alpha2Code(null);
      expect(result).toBe(false);
    });

    test('when the input is undefined', () => {
      const result = isValidIso3166Alpha2Code(undefined);
      expect(result).toBe(false);
    });

    test('when the input is a country', () => {
      const result = isValidIso3166Alpha2Code('Spain');
      expect(result).toBe(false);
    });

    test('when the input is valid code but in wrong case', () => {
      const result = isValidIso3166Alpha2Code('pt');
      expect(result).toBe(false);
    });

    test('when the input is a boolean', () => {
      const result = isValidIso3166Alpha2Code(true);
      expect(result).toBe(false);
    });
  });

  describe('returns true', () => {
    test('when the input is a valid ISO 3166-1 alpha-2 code', () => {
      const result = isValidIso3166Alpha2Code('US');
      expect(result).toBe(true);
    });
  });
});
