import tk from 'timekeeper';

import moment from 'moment';
import { UserRole } from '../../../src/controllers/users/users.types';
import {
  CustomJwtPayload,
  JwtUtils,
  RawJwtPayload,
} from '../../../src/utils/jwt-utils';

const TARGET_DATE = moment('2021-01-01T00:00:00Z');

describe('JwtUtils', () => {
  beforeAll(() => {
    tk.freeze(TARGET_DATE.toDate());
  });

  afterAll(() => {
    tk.reset();
  });

  test('should decrypto a token', () => {
    const expectedExp = moment(TARGET_DATE).add(6, 'hours').unix();
    const expectedIat = TARGET_DATE.unix();

    const payload: Omit<RawJwtPayload, 'iat' | 'exp'> = {
      id: '123',
      role: UserRole.ADMIN,
      email: 'tiago@mail.com',
    };
    const token = JwtUtils.sign(payload);
    const decryptedPayload: CustomJwtPayload = JwtUtils.verify(token);

    expect(decryptedPayload).toEqual({
      id: payload.id,
      role: payload.role,
      email: payload.email,
      iat: expectedIat,
      exp: expectedExp,
    });
  });
});
