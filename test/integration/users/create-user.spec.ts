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

    test('when role is missing', async () => {
      const userDto = { email: 'some-email@mail.com' };
      const response = await fetch(getTestServerUrl('/api/users').href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`must have required property 'role'`);
    });
  });
});
