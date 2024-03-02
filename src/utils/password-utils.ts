import { scryptSync, randomBytes } from 'node:crypto';
import CONSTANTS from '../constants';

export type CyphredPassword = {
  salt: string;
  hash: string;
  iterations: number;
};

export class PasswordUtils {
  private static encryptPassword(
    password: string,
    salt: string,
    iterations = CONSTANTS.DEFAULT_AMOUNT_OF_SALT_ITERATIONS,
  ): string {
    return scryptSync(password, salt, iterations).toString('hex');
  }

  public static generateRandomToken(
    length: number,
    encoding: BufferEncoding = 'hex',
  ): string {
    return randomBytes(length).toString(encoding).slice(0, length);
  }

  public static hashPassword(
    password: string,
    iterations = CONSTANTS.DEFAULT_AMOUNT_OF_SALT_ITERATIONS,
  ): CyphredPassword {
    const salt = PasswordUtils.generateRandomToken(64);
    const hash = PasswordUtils.encryptPassword(password, salt, iterations);
    return { salt, hash, iterations };
  }

  public static matchPassword(
    password: string,
    cyphredPassword: CyphredPassword,
  ): boolean {
    const currentPassHash = PasswordUtils.encryptPassword(
      password,
      cyphredPassword.salt,
      cyphredPassword.iterations,
    );
    return cyphredPassword.hash === currentPassHash;
  }
}
