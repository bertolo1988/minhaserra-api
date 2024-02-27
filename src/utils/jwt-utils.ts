import jwt, { JwtPayload } from 'jsonwebtoken';

import CONFIG from '../config';
import { UserRole } from '../controllers/users/users.types';

export type RawJwtPayload = {
  id: string;
  role: UserRole;
  email: string;
};

export type CustomJwtPayload = RawJwtPayload & JwtPayload;

export class JwtUtils {
  static sign(payload: RawJwtPayload): string {
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
      throw new Error('Invalid token');
    }
  }
}
