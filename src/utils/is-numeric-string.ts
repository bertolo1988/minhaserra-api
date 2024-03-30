/**
 * Determine whether the given `input` is a number.
 * @param {unknown} input
 * @returns {boolean}
 */
export function isNumericString(input: unknown): boolean {
  return typeof input === 'string' && /^-?\d+$/.test(input);
}
