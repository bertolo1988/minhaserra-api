import { UserDto, UserRole } from '../../../src/controllers/users/users.types';
import { ApiServer, defaultServerOptions } from '../../../src/server';
import { getTestServerUrl } from '../integration-test-utils';

describe('POST /api/users', () => {
  let server: ApiServer;

  beforeAll(async () => {
    server = new ApiServer(defaultServerOptions);
    await server.start();
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
      expect(body.message).toBe(`role must be either \"buyer\" or \"seller\"`);
    });

    test('when a non allowed extra property exists', async () => {
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
  });

  describe('returns status 201', () => {
    test.only('when user is created successfully', async () => {
      const userDto = {
        email: 'when-role-is-invalid@mail.com',
        organizationName: 'My Organization',
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
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.id).toBe(1);
    });
  });
});
