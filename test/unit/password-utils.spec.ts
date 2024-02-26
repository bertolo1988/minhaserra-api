import { PasswordUtils } from '../../src/utils/password-utils';

describe('PasswordUtils', () => {
  it('matchPassword should return true if password is correct', () => {
    const password = 'password';
    const { hash, salt, iterations } = PasswordUtils.hashPassword(password);
    const isPasswordCorrect = PasswordUtils.matchPassword(
      hash,
      password,
      salt,
      iterations,
    );
    expect(isPasswordCorrect).toBe(true);
  });

  it('matchPassword should return false if password is incorrect', () => {
    const password = 'password';
    const { hash, salt, iterations } = PasswordUtils.hashPassword(password);
    const isPasswordCorrect = PasswordUtils.matchPassword(
      hash,
      `wrong-pass`,
      salt,
      iterations,
    );
    expect(isPasswordCorrect).toBe(false);
  });

  describe('hashPassword', () => {
    it('should return a hash, salt and iterations', () => {
      const password = 'password';
      const { hash, salt, iterations } = PasswordUtils.hashPassword(password);
      expect(hash).toBeDefined();
      expect(salt).toBeDefined();
      expect(iterations).toBeDefined();
    });
  });
});
