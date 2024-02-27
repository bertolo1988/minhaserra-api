import { ApiServer, defaultServerOptions } from '../../../src/server';
import { CustomJwtPayload, JwtUtils } from '../../../src/utils/jwt-utils';
import {
  unverifiedUser,
  unverifiedUserPassword,
  verifiedUser,
  verifiedUserPassword,
} from '../../seeds/login.seed';
import { runSeedByName } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';

const PORT = 8083;

describe('POST /api/login', () => {
  let server: ApiServer;

  beforeAll(async () => {
    server = new ApiServer({ ...defaultServerOptions, port: PORT });
    await server.start();
    await runSeedByName('login.seed.ts');
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('should return 400', () => {
    it('if email is missing', async () => {
      const response = await fetch(getTestServerUrl('/api/login', PORT).href, {
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

    it('password is missing', async () => {
      const response = await fetch(getTestServerUrl('/api/login', PORT).href, {
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
    it('if user does not exist', async () => {
      const response = await fetch(getTestServerUrl('/api/login', PORT).href, {
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

    it('if user is unverified', async () => {
      const response = await fetch(getTestServerUrl('/api/login', PORT).href, {
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

    it('if password is wrong', async () => {
      const response = await fetch(getTestServerUrl('/api/login', PORT).href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verifiedUser.email,
          password: 'wrong-password-123%',
        }),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe(`Unauthorized`);
    });
  });

  describe('should return 200', () => {
    it('if the credentials are correct for a verified user', async () => {
      const response = await fetch(getTestServerUrl('/api/login', PORT).href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verifiedUser.email,
          password: verifiedUserPassword,
        }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.token).toBeDefined();
      const decryptedPayload: CustomJwtPayload = JwtUtils.verify(body.token);
      expect(decryptedPayload.iat).toBeDefined();
      expect(decryptedPayload.exp).toBeDefined();
      expect(decryptedPayload.id).toBe(verifiedUser.id);
      expect(decryptedPayload.role).toBe(verifiedUser.role);
      expect(decryptedPayload.email).toBe(verifiedUser.email);
    });
  });
});
