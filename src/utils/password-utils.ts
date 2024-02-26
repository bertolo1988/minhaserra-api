import { scryptSync, randomBytes } from 'node:crypto';
import CONSTANTS from '../constants';

export class PasswordUtils {
  private static encryptPassword(
    password: string,
    salt: string,
    iterations = CONSTANTS.DEFAULT_AMOUNT_OF_SALT_ITERATIONS,
  ): string {
    return scryptSync(password, salt, iterations).toString('hex');
  }

  private static generateRandomToken(
    length: number,
    encoding: BufferEncoding = 'hex',
  ): string {
    return randomBytes(length).toString(encoding).slice(0, length);
  }

  public static hashPassword(
    password: string,
    iterations = CONSTANTS.DEFAULT_AMOUNT_OF_SALT_ITERATIONS,
  ): {
    salt: string;
    hash: string;
    iterations: number;
  } {
    const salt = PasswordUtils.generateRandomToken(64);
    const hash = PasswordUtils.encryptPassword(password, salt, iterations);
    return { salt, hash, iterations };
  }

  public static matchPassword(
    originalPassHash: string,
    password: string,
    salt: string,
    iterations: number,
  ): boolean {
    const currentPassHash = PasswordUtils.encryptPassword(
      password,
      salt,
      iterations,
    );
    return originalPassHash === currentPassHash;
  }
}
