import { isNumericString } from '../../../src/utils/is-numeric-string';

describe('isNumericString', () => {
  describe('should return true', () => {
    test('when the string is a string number', () => {
      expect(isNumericString('123')).toBe(true);
    });

    test('when the string is a negative number', () => {
      expect(isNumericString('-23')).toBe(true);
    });
  });

  describe('should return false', () => {
    test('when the string is a number', () => {
      expect(isNumericString(111)).toBe(false);
    });

    test('when the input is null', () => {
      expect(isNumericString(null)).toBe(false);
    });

    test('when the input is undefined', () => {
      expect(isNumericString(undefined)).toBe(false);
    });

    test('when the input is Infinity', () => {
      expect(isNumericString(Infinity)).toBe(false);
    });

    test('when the input false', () => {
      expect(isNumericString(false)).toBe(false);
    });

    test('when the input is a string with spaces', () => {
      expect(isNumericString(' 123 ')).toBe(false);
    });

    test('when the input is a string with a number', () => {
      expect(isNumericString('10px')).toBe(false);
    });

    test('when the input is an empty array', () => {
      expect(isNumericString([])).toBe(false);
    });

    test('when the input is an object', () => {
      expect(isNumericString({})).toBe(false);
    });

    test('when the input is a function', () => {
      expect(isNumericString(() => {})).toBe(false);
    });
  });
});
