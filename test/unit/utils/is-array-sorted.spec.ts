import {
  isArraySortedAscending,
  isArraySortedDescending,
} from '../../../src/utils/other-utils';

describe('isArraySortedDescending', () => {
  describe('should return false', () => {
    test('when input is numeric array of natural values in a random order', () => {
      expect(isArraySortedDescending([5, 4, 3, 4, 2, 1])).toBe(false);
    });

    test('when input is numeric array of floats in a random order', () => {
      expect(isArraySortedDescending([-55.1, 4, 3, 4, 2, 1])).toBe(false);
    });
  });

  describe('should return true', () => {
    test('when input is sorted numeric array of natural values', () => {
      expect(isArraySortedDescending([3, 2, 1])).toBe(true);
    });

    test('when input is empty array', () => {
      expect(isArraySortedDescending([])).toBe(true);
    });

    test('when input has negative values and negative floats', () => {
      expect(isArraySortedDescending([3, -1, -1.1])).toBe(true);
    });
  });
});

describe('isArraySortedAscending', () => {
  describe('should return false', () => {
    test('when input is numeric array of natural values in a random order', () => {
      expect(isArraySortedAscending([5, 4, 3, 4, 2, 1])).toBe(false);
    });

    test('when input is numeric array of floats in a random order', () => {
      expect(isArraySortedAscending([-55.1, 4, 3, 4, 2, 1])).toBe(false);
    });
  });

  describe('should return true', () => {
    test('when input is sorted numeric array of natural values', () => {
      expect(isArraySortedAscending([1, 2, 3])).toBe(true);
    });

    test('when input is empty array', () => {
      expect(isArraySortedAscending([])).toBe(true);
    });

    test('when input has negative values and negative floats', () => {
      expect(isArraySortedAscending([-1.1, -1, 3])).toBe(true);
    });
  });
});
