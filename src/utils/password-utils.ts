import { scryptSync, randomBytes } from 'node:crypto';

const DEFAULT_ITERATIONS = 128;

function encryptPassword(
  password: string,
  salt: string,
  iterations = DEFAULT_ITERATIONS,
) {
  return scryptSync(password, salt, iterations).toString('hex');
}

export function generateRandomToken(
  length: number,
  encoding: BufferEncoding = 'hex',
): string {
  return randomBytes(length).toString(encoding).slice(0, length);
}

export function hashPassword(
  password: string,
  iterations = DEFAULT_ITERATIONS,
): {
  salt: string;
  hash: string;
  iterations: number;
} {
  const salt = generateRandomToken(64);
  const hash = encryptPassword(password, salt, iterations);
  return { salt, hash, iterations };
}

export function matchPassword(
  originalPassHash: string,
  password: string,
  salt: string,
  iterations: number,
): boolean {
  const currentPassHash = encryptPassword(password, salt, iterations);
  return originalPassHash === currentPassHash;
}
