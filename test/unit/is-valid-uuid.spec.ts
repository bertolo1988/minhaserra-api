import isValidUUID from '../../src/utils/is-valid-uuid';

describe('isValidUUID', () => {
  describe('should return true', () => {
    test('if input is valid UUID version 4', () => {
      const input = '7a71cb03-bf0b-41ec-9528-afc6472ad6d8';
      expect(isValidUUID(input)).toBe(true);
    });
  });

  describe('should return false', () => {
    test('if input is valid UUID version 1', () => {
      const input = '2937c950-d11e-11ee-a409-c7ff85997234';
      expect(isValidUUID(input)).toBe(false);
    });

    test('if input is valid UUID version 7', () => {
      const input = '018dce45-b8a6-7be3-806f-04175a7eaae3';
      expect(isValidUUID(input)).toBe(false);
    });

    test('if input is not a valid UUID', () => {
      const input = 'invalid-uuid';
      expect(isValidUUID(input)).toBe(false);
    });

    test('if input is null', () => {
      const input = null;
      expect(isValidUUID(input)).toBe(false);
    });

    test('if input is undefined', () => {
      const input = undefined;
      expect(isValidUUID(input)).toBe(false);
    });
  });
});
