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
      const userDto = {};
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

    test('when role is invalid (cant register admin)', async () => {
      const userDto: UserDto = {
        email: 'when-role-is-invalid@mail.com',
        role: UserRole.ADMIN,
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
  });

  describe('returns status 201', () => {
    test('when user is created successfully', async () => {
      const userDto = {
        email: 'some-user1@gmail.com',
        role: UserRole.BUYER,
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
      expect(body.message).toBe(`must have required property 'email'`);
    });
  });
});
