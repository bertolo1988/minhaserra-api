import jwt, { JwtPayload } from 'jsonwebtoken';

import CONFIG from '../config';
import { UserRole } from '../controllers/users/users.types';
import { UnauthorizedError } from '../types/errors/unauthorized.error';

export type RawJwtPayload = {
  id: string;
  role: UserRole;
  email: string;
  exp: number;
  iat: number;
};

export type CustomJwtPayload = RawJwtPayload & JwtPayload;

export class JwtUtils {
  static sign(payload: Omit<RawJwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, CONFIG.authentication.jwtSecret, {
      expiresIn: `${CONFIG.authentication.jwtExpirationHours}h`,
      algorithm: CONFIG.authentication.algorithm,
    });
  }

  static verify(token: string): CustomJwtPayload {
    try {
      return jwt.verify(token, CONFIG.authentication.jwtSecret, {
        algorithms: [CONFIG.authentication.algorithm],
      }) as CustomJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Authorization expired');
      } else {
        throw new UnauthorizedError();
      }
    }
  }
}
