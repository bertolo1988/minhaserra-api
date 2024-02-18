import { UserDto, UserRole } from '../../../src/controllers/users/users.types';
import { ApiServer, defaultServerOptions } from '../../../src/server';
import { truncateAllTables } from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';

describe('POST /api/users', () => {
  let server: ApiServer;

  beforeAll(async () => {
    server = new ApiServer(defaultServerOptions);
    await server.start();
    await truncateAllTables();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('returns status 400', () => {
    test('when email is missing', async () => {
      const userDto = {
        role: UserRole.BUYER,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        termsVersion: 1,
      };
      const response = await fetch(getTestServerUrl('/api/users').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must have required property 'email'`);
    });

    test('when email format is not ok', async () => {
      const userDto = {
        email: 'when-role-is',
        role: UserRole.BUYER,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        termsVersion: 1,
      };
      const response = await fetch(getTestServerUrl('/api/users').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must match format "email"`);
    });

    test('when role is ADMIN', async () => {
      const userDto: UserDto = {
        email: 'when-role-is-invalid@mail.com',
        role: UserRole.ADMIN,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        termsVersion: 1,
      };
      const response = await fetch(getTestServerUrl('/api/users').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `'role' must be either \"buyer\" or \"seller\"`,
      );
    });

    test('when a not allowed extra property exists', async () => {
      const userDto = {
        email: 'when-role-is-invalid@mail.com',
        role: UserRole.BUYER,
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        termsVersion: 1,
        aaa: 'mansdlansdla',
      };
      const response = await fetch(getTestServerUrl('/api/users').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must NOT have additional properties`);
    });

    test('when password has minimum size of 8, has digit, has upper case but misses special character', async () => {
      const userDto = {
        email: 'when-role-is-invalid@mail.com',
        role: UserRole.BUYER,
        firstName: 'John',
        lastName: 'Doe',
        password: 'pbaskdjbakjsdbakjdsB1',
        termsVersion: 1,
      };
      const response = await fetch(getTestServerUrl('/api/users').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `'password' must be have at least 8 characters and at most 64 characters, and must contain at least one uppercase letter, one lowercase letter, one digit, and one special character`,
      );
    });
  });

  describe('returns status 201', () => {
    test('when user is created successfully', async () => {
      const userDto = {
        email: 'when-role-is-invalid@mail.com',
        organizationName: 'My Organization',
        role: UserRole.BUYER,
        firstName: 'John',
        lastName: 'Doe',
        password:
          'r9p6x2M9kR79oSycuxdi6CcHDXRnLkhQtUMr7ylhTyTPEC8ejEK65SuVugaMO1#C',
        termsVersion: 1,
      };
      const response = await fetch(getTestServerUrl('/api/users').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.id).toBe(1);
    });
  });
});
