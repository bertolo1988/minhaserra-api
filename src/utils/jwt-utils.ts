import jwt from 'jsonwebtoken';

import CONFIG from '../config';
import { UserRole } from '../controllers/users/users.types';

export type JwtPayload = {
  id: string;
  role: UserRole;
  email: string;
};

export class JwtUtils {
  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, CONFIG.authentication.jwtSecret, {
      expiresIn: `${CONFIG.authentication.jwtExpirationHours}h`,
      algorithm: CONFIG.authentication.algorithm,
    });
  }

  static verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, CONFIG.authentication.jwtSecret, {
        algorithms: [CONFIG.authentication.algorithm],
      }) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
