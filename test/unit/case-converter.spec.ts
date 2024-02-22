import { CaseConverter } from '../../src/utils/case-converter';

describe('CaseConverter', () => {
  describe('camelToSnake', () => {
    test('should convert camel case to snake case', () => {
      const result = CaseConverter.camelToSnake('firstName');
      expect(result).toBe('first_name');
    });
  });

  describe('snakeToCamel', () => {
    test('should convert snake case to camel case', () => {
      const result = CaseConverter.snakeToCamel('first_name');
      expect(result).toBe('firstName');
    });
  });

  describe('objectKeysCamelToSnake', () => {
    test('should return null if object is null', () => {
      const obj = null;
      const result = CaseConverter.objectKeysCamelToSnake(
        obj as unknown as Record<string, any>,
      );
      expect(result).toEqual(null);
    });

    test('should return undefined if object is undefined', () => {
      const obj = undefined;
      const result = CaseConverter.objectKeysCamelToSnake(
        obj as unknown as Record<string, any>,
      );
      expect(result).toEqual(undefined);
    });

    test('should convert object keys from camel to snake case', () => {
      const obj = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'ti@mail.com',
        aB: undefined,
        jTeTe: null,
      };
      const result = CaseConverter.objectKeysCamelToSnake(obj);
      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email: 'ti@mail.com',
        a_b: undefined,
        j_te_te: null,
      });
    });
  });

  describe('objectKeysSnakeToCamel', () => {
    test('should return null if object is null', () => {
      const obj = null;
      const result = CaseConverter.objectKeysSnakeToCamel(
        obj as unknown as Record<string, any>,
      );
      expect(result).toEqual(null);
    });

    test('should return undefined if object is undefined', () => {
      const obj = undefined;
      const result = CaseConverter.objectKeysSnakeToCamel(
        obj as unknown as Record<string, any>,
      );
      expect(result).toEqual(undefined);
    });

    test('should convert object keys from snake to camel case', () => {
      const obj = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'ti@mail.com',
        a_b: undefined,
        j_te_te: null,
      };
      const result = CaseConverter.objectKeysSnakeToCamel(obj);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'ti@mail.com',
        aB: undefined,
        jTeTe: null,
      });
    });
  });
});
