import { CustomJwtPayload, JwtUtils } from '../../../src/utils/jwt-utils';
import {
  inactiveUser,
  inactiveUserPassword,
  softDeletedUser,
  softDeletedUserPassword,
  unverifiedUser,
  unverifiedUserPassword,
  verifiedUserBuyer,
  verifiedUserBuyerPassword,
} from '../../seeds/multiple-users.seed';
import { DatabaseSeedNames, runSeedByName } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

describe('POST /api/login', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.MULTIPLE_USERS);
  });

  describe('should return 400', () => {
    test('if email is missing', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must have required property 'email'`);
    });

    test('password is missing', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'tiago@mail.com',
        }),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must have required property 'password'`);
    });
  });

  describe('should return 401', () => {
    test('if user is inactive', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inactiveUser.email,
          password: inactiveUserPassword,
        }),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if user is soft deleted', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: softDeletedUser.email,
          password: softDeletedUserPassword,
        }),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if user does not exist', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'aaa@mail.com',
          password: '123456',
        }),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if user is unverified', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: unverifiedUser.email,
          password: unverifiedUserPassword,
        }),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });

    test('if password is wrong', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verifiedUserBuyer.email,
          password: 'wrong-password-123%',
        }),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });
  });

  describe('should return 200', () => {
    test('if the credentials are correct for a verified user', async () => {
      const response = await fetch(getTestServerUrl('/api/login').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verifiedUserBuyer.email,
          password: verifiedUserBuyerPassword,
        }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.id).toBe(verifiedUserBuyer.id);
      expect(body.token).toBeDefined();
      const decryptedPayload: CustomJwtPayload = JwtUtils.verify(body.token);
      expect(decryptedPayload.iat).toBeDefined();
      expect(decryptedPayload.exp).toBeDefined();
      expect(decryptedPayload.id).toBe(verifiedUserBuyer.id);
      expect(decryptedPayload.role).toBe(verifiedUserBuyer.role);
      expect(decryptedPayload.email).toBe(verifiedUserBuyer.email);
    });
  });
});
