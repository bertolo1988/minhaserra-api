import { scryptSync, randomBytes } from 'node:crypto';

const DEFAULT_ITERATIONS = 64;

function encryptPassword(
  password: string,
  salt: string,
  iterations = DEFAULT_ITERATIONS,
) {
  return scryptSync(password, salt, iterations).toString('hex');
}

export function hashPassword(
  password: string,
  iterations = DEFAULT_ITERATIONS,
): {
  salt: string;
  hash: string;
  iterations: number;
} {
  const salt = randomBytes(64).toString('base64');
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
